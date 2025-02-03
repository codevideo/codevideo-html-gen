import { buildHTML } from "./buildHTML.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import util from 'util';
import { recordVideo } from "./recordVideo.js";
// import { silvanExample } from "./examples/silvanExample.js";
// import { franziExample } from "./examples/franziExample.js";
// import { vroniExample } from "./examples/vroniExample.js";
// import { simonExample } from "./examples/simonExample.js";
// import { advancedRustExampleActions } from "./examples/advancedRustExampleActions.js";
import { twoFileComplexEditsExample } from "./examples/twoFileComplexEditsExample.js";

const execPromise = util.promisify(exec);

export const main = async () => {
    // define the output directory for the HTML snapshots
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // create the output directory if it doesn't exist
    const htmlOutputDir = path.resolve(__dirname, "html_snapshots");
    if (!fs.existsSync(htmlOutputDir)) {
        fs.mkdirSync(htmlOutputDir);
    }

    // empty the output directory
    fs.readdirSync(htmlOutputDir).forEach((file) => {
        const curPath = path.join(htmlOutputDir, file);
        fs.unlinkSync(curPath);
    });

    // change these as needed: should correspond to the action import more or less
    const filenamePrefix = "two-file-complex-edits-example";
    const actions = twoFileComplexEditsExample;

    // from 0 to length of action, build viewer HTML for single steps
    for (let i = 0; i < actions.length; i++) {
        const startIndex = i;
        const endIndex = i + 1;

        // Build the final viewer HTML using the external template.
        const viewerHTML = buildHTML(actions, startIndex, endIndex);

        // Write the viewer HTML to a file
        const fullOutputPath = path.join(htmlOutputDir, `${filenamePrefix}-${startIndex}.html`);
        fs.writeFileSync(
            fullOutputPath,
            viewerHTML,
            { encoding: "utf8" }
        );

        // get file size
        const stats = fs.statSync(fullOutputPath);
        const fileSizeInBytes = stats.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

        console.log("HTML written to " + fullOutputPath, "Size: " + fileSizeInMB.toFixed(2) + " MB");
        // console.log("Open in a legends browser (i.e. Chrome) at: file://" + fullOutputPath);
    }

    // for each of those HTML, record the video (can do in parallel)
    const videoOutputDir = path.resolve(__dirname, "videos");
    if (!fs.existsSync(videoOutputDir)) {
        fs.mkdirSync(videoOutputDir);
    }

    fs.readdirSync(videoOutputDir).forEach((file) => {
        const curPath = path.join(videoOutputDir, file);
        fs.unlinkSync(curPath);
    });

    await processAndStitchVideos(actions, htmlOutputDir, videoOutputDir, filenamePrefix);
}

async function processAndStitchVideos(
    actions: any[],
    htmlOutputDir: string,
    videoOutputDir: string,
    filenamePrefix: string
  ): Promise<string> {
    // First record all videos in parallel
    await recordAllVideos(actions, htmlOutputDir, videoOutputDir, filenamePrefix);
  
    // Then stitch them together
    const finalOutput = path.join(videoOutputDir, `${filenamePrefix}-final.mp4`);
    return await stitchVideos(
      videoOutputDir,
      filenamePrefix,
      actions.length,
      finalOutput
    );
  }

async function recordAllVideos(
    actions: any[],
    htmlOutputDir: string,
    videoOutputDir: string,
    filenamePrefix: string
): Promise<string[]> {
    // Create array of recording promises
    const recordingPromises = actions.map((_, i) => {
        const htmlPath = path.join(htmlOutputDir, `${filenamePrefix}-${i}.html`);
        const videoPath = path.join(videoOutputDir, `${filenamePrefix}-${i}.mp4`);

        console.log(`Queuing recording for ${htmlPath}`);
        return recordVideo(htmlPath);
    });

    // Execute all recordings in parallel
    try {
        const results = await Promise.all(recordingPromises);
        console.log('All recordings completed successfully');
        return results;
    } catch (error) {
        console.error('Error during parallel recording:', error);
        throw error;
    }
}

async function stitchVideos(
    videoDir: string,
    filenamePrefix: string,
    numVideos: number,
    outputPath: string
): Promise<string> {
    try {
        // Create a temporary file listing all videos to concatenate
        const concatFilePath = path.join(videoDir, 'concat_list.txt');

        // Generate the content for the concat file
        const concatContent = Array.from({ length: numVideos }, (_, i) => {
            const videoPath = path.join(videoDir, `${filenamePrefix}-${i}.mp4`);
            return `file '${videoPath}'`;
        }).join('\n');

        // Write the concat file
        await fs.writeFileSync(concatFilePath, concatContent);

        // Construct the ffmpeg command
        const ffmpegCommand = [
            'ffmpeg',
            '-y', // Overwrite output file if it exists
            '-f', 'concat',
            '-safe', '0',
            '-i', concatFilePath,
            '-c', 'copy', // Use copy codec for faster processing
            outputPath
        ].join(' ');

        console.log('Starting video concatenation...');
        const { stdout, stderr } = await execPromise(ffmpegCommand);

        // Clean up the temporary concat file
        await fs.unlinkSync(concatFilePath);

        if (stderr) {
            console.warn('FFmpeg warnings:', stderr);
        }

        console.log('Video concatenation complete:', outputPath);
        return outputPath;

    } catch (error) {
        console.error('Error during video concatenation:', error);
        throw error;
    }
}

main();
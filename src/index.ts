import { buildViewerHTML } from "./buildViewerHtml.js";
import { advancedRustExampleActions } from "./examples/advancedRustExampleActions.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const main = () => {
    // define the output directory for the HTML snapshots
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const htmlOutputDir = path.resolve(__dirname, "html_snapshots");
    if (!fs.existsSync(htmlOutputDir)) {
        fs.mkdirSync(htmlOutputDir);
    }

    // Build the final viewer HTML using the external template.
    const viewerHTML = buildViewerHTML(advancedRustExampleActions);

    // Write the viewer HTML to a file
    const fullOutputPath = path.join(htmlOutputDir, "codevideo.html");
    fs.writeFileSync(
        fullOutputPath,
        viewerHTML,
        { encoding: "utf8" }
    );
    
    // get file size
    const stats = fs.statSync(fullOutputPath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    console.log("HTML written to " + fullOutputPath, "File size: " + fileSizeInMB + " KB");
}

main();
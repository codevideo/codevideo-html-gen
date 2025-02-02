import { buildViewerHTML } from "./buildViewerHtml.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { silvanExample } from "./examples/silvanExample.js";

export const main = () => {
    // define the output directory for the HTML snapshots
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const htmlOutputDir = path.resolve(__dirname, "html_snapshots");
    if (!fs.existsSync(htmlOutputDir)) {
        fs.mkdirSync(htmlOutputDir);
    }

    // Build the final viewer HTML using the external template.
    const viewerHTML = buildViewerHTML(silvanExample);

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

    console.log("HTML written to " + fullOutputPath, "Size: " + fileSizeInMB.toFixed(2) + " MB");
    console.log("Open in a legends browser (i.e. Chrome) at: file://" + fullOutputPath);
}

main();
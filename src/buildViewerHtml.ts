import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { VirtualIDE } from "@fullstackcraftllc/codevideo-virtual-ide";
import { renderSnapshot } from "./renderSnapshot.js";
/**
 * Builds the viewer HTML by applying actions to a VirtualIDE, capturing snapshots,
 * and then reading in the external HTML template to inject the snapshots JSON.
 */
export const buildViewerHTML = (actions: any[]): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const virtualIDE = new VirtualIDE();

  // Array to hold snapshots.
  const snapshotsArray: { html: string; speak: string; editors?: any[] }[] = [];

  actions.forEach(action => {
    virtualIDE.applyAction(action);
    const snapshot = virtualIDE.getCourseSnapshot();
    const snapshotHtml = renderSnapshot(snapshot);
    const speakText = action.name.startsWith("author-speak") ? action.value : "";
    snapshotsArray.push({
      html: snapshotHtml,
      speak: speakText,
      editors: snapshot.editorSnapshot?.editors || []
    });
  });

  // Write snapshots.json for debugging purposes.
  fs.writeFileSync(
    path.join(__dirname, "snapshots.json"),
    JSON.stringify(snapshotsArray, null, 2),
    { encoding: "utf8" }
  );

  // Read the external viewer template.
  const viewerTemplatePath = path.resolve(__dirname, "html", "VIEWER_TEMPLATE.html");
  let viewerTemplate = fs.readFileSync(viewerTemplatePath, { encoding: "utf8" });
  // Replace the placeholder with the JSON string.
  viewerTemplate = viewerTemplate.replace(
    "__SNAPSHOTS_JSON__",
    JSON.stringify(snapshotsArray)
  );
  return viewerTemplate;
}
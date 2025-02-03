import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { VirtualIDE } from "@fullstackcraftllc/codevideo-virtual-ide";
import { renderSnapshot } from "./renderSnapshot.js";
/**
 * Builds the viewer HTML by applying actions to a VirtualIDE, capturing snapshots,
 * and then reading in the external HTML template to inject the snapshots JSON.
 * @param actions - The actions to apply to the VirtualIDE.
 * @param startIndex - Optional. The index to start applying actions.
 * @param endIndex - Optional. The index to stop applying actions.
 * @returns The viewer HTML as a string.
 * @example
 * // run for the full length of actions
 * const viewerHTML = buildViewerHTML(actions);
 * fs.writeFileSync("viewer.html", viewerHTML, { encoding: "utf8" });
 * @example
 * // run for the first 5 actions
 * const viewerHTML = buildViewerHTML(actions, 0, 5);
 * fs.writeFileSync("viewer.html", viewerHTML, { encoding: "utf8" });
 * @example
 * // run for only the 3rd to 4th action (single step recording is what is used for batch video generation)
 * const viewerHTML = buildViewerHTML(actions, 2, 3); // 2 is the 3rd action, 3 is the 4th action
 * fs.writeFileSync("viewer.html", viewerHTML, { encoding: "utf8" });
 */
export const buildHTML = (actions: any[], startIndex?: number, endIndex?: number): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const virtualIDE = new VirtualIDE();

  // Array to hold snapshots.
  const snapshotsArray: { html: string; speak: string; editors?: any[] }[] = [];

  // If startIndex is provided, apply all actions up to that index before capturing snapshots.
  if (startIndex) {
    const actionsToApplyUpToStartIndex = actions.slice(0, startIndex);
    actionsToApplyUpToStartIndex.forEach(action => {
      virtualIDE.applyAction(action);
    });
  }

  // Use startIndex only if provided, otherwise start at the beginning.
  const resolvedStartIndex = startIndex || 0;

  // Use endIndex only if provided, otherwise use the full rest of the actions.
  const resolvedEndIndex = endIndex || actions.length;

  const actionsToApply = actions.slice(resolvedStartIndex, resolvedEndIndex);

  actionsToApply.forEach(action => {
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
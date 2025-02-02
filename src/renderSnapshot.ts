/**
 * Renders a snapshot of the VirtualIDE state as a full HTML fragment.
 * (This function remains unchanged from your original implementation.)
 */
export const renderSnapshot = (snapshot: any): string => {
    // Helper to recursively render the file structure.
    const renderFileStructure = (fsObj: any): string => {
      let html = "<ul style='list-style: none; padding-left: 10px; margin: 0;'>";
      for (const name in fsObj) {
        const node = fsObj[name];
        if (node.type === "directory") {
          html += `<li style="margin: 2px 0;"><strong>${name}</strong>`;
          if (node.children) {
            html += renderFileStructure(node.children);
          }
          html += `</li>`;
        } else {
          html += `<li style="margin: 2px 0;">${name}</li>`;
        }
      }
      html += "</ul>";
      return html;
    };
  
    // File Explorer snapshot.
    const fileStructure = snapshot.fileExplorerSnapshot?.fileStructure || {};
    const fileExplorerHTML = renderFileStructure(fileStructure);
  
    // Build Editor Tabs (for static snapshot, these might be used for display only)
    let editorTabsHTML = "";
    const editors = snapshot.editorSnapshot?.editors || [];
    for (let i = 0; i < editors.length; i++) {
      const editor = editors[i];
      const active = i === 0;
      const savedMarker = editor.isSaved ? "•" : "x";
      editorTabsHTML += `
        <div style="
            padding: 2px 5px;
            border: 1px solid black;
            margin-right: 5px;
            background: ${active ? "#ddd" : "#fff"};
            display: inline-block;">
          ${editor.filename} <span style="color: ${editor.isSaved ? "green" : "red"};">${savedMarker}</span>
        </div>`;
    }
  
    // In this updated version, we output an "editor area" that will be replaced by Monaco.
    const editorAreaHTML = `
      <div id="editor-area" style="flex: 1; display: flex; flex-direction: column; position: relative;">
        <!-- Editor Tabs -->
        <div id="editor-tabs" style="height: 30px; border-bottom: 1px solid black; overflow-x: auto; padding: 5px;">
          ${editorTabsHTML}
        </div>
        <!-- Monaco editor will be injected here -->
        <div id="monaco-editor-container" style="flex: 1;"></div>
      </div>
    `;
  
    // Terminal content.
    const terminals = snapshot.terminalSnapshot?.terminals || [];
    const terminalContent = terminals.length > 0 ? terminals[0].content : "";
  
    // Mouse pointer snapshot.
    const mouseSnapshot = snapshot.mouseSnapshot || { x: 0, y: 0 };
    const mouseLeft = mouseSnapshot.x - 2;
    const mouseTop = mouseSnapshot.y - 2;
    const mouseSVGHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" style="position: absolute; left: ${mouseLeft}px; top: ${mouseTop}px; pointer-events: none; transform: scale(0.8); z-index: 1000;">
        <path d="M 0,0 L 0,20 L 4.5,15.5 L 8.75,23 L 11,22 L 6.75,15 L 13.75,15 Z" fill="black" stroke="white" stroke-width="1.5" stroke-linejoin="round"></path>
      </svg>
    `;
  
    // Assemble the complete snapshot HTML.
    const html = `
      <div style="display: flex; flex-direction: column; height: 100vh; position: relative;">
        <!-- Main IDE Area -->
        <div style="flex: 1; display: flex;">
          <!-- File Explorer -->
          <div style="width: 250px; border: 1px solid black; padding: 5px; overflow: auto;">
            ${fileExplorerHTML}
          </div>
          <!-- Editor Area -->
          <div style="flex: 1; border: 1px solid black; display: flex; flex-direction: column; position: relative;">
            ${editorAreaHTML}
          </div>
        </div>
        <!-- Terminal Area -->
        <div style="height: 150px; border: 1px solid black; padding: 5px; overflow: auto; font-family: monospace;">
          <div style="font-weight: bold;">codevideo &gt;</div>
          <pre style="margin:0;"><code class="language-javascript">${terminalContent}</code></pre>
        </div>
        <!-- Mouse Pointer SVG -->
        ${mouseSVGHTML}
      </div>
    `;
    return html;
  }
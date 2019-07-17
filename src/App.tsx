import React, { createContext, useEffect, useState } from "react";
import { Editor, EditorView } from "./editor";
import { ItemPanel } from "./layout/ItemPanel";
import { StylePanel } from "./layout/StylePanel";
import { Toolbar } from "./layout/Toolbar";

export const EditorContext = createContext<Editor | null>(null);

export const App: React.FC = () => {
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    const editorInstance = new Editor({
      size: { width: 500, height: 250 },
      transform: { s: 1, x: 200, y: 200 }
    });
    setEditor(editorInstance);
  }, []);

  return (
    <div className="main">
      <Toolbar editor={editor} />
      <div className="main-content">
        <ItemPanel editor={editor} />
        <div className="editor-content">
          <EditorView editor={editor} />
        </div>
        <StylePanel editor={editor} />
      </div>
    </div>
  );
};

export default App;

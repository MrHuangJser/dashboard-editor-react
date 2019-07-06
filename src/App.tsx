import React, { useEffect, useRef } from "react";
import { Editor, EditorView } from "./editor";

export const App: React.FC = () => {
  const editor = useRef<Editor | null>(null);

  useEffect(() => {
    editor.current = new Editor();
  }, []);

  return (
    <div className="main">
      <div className="item-panel" />
      <div className="main-content">
        <EditorView editor={editor.current} />
      </div>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { Editor, EditorView, Item } from "./editor";

export const App: React.FC = () => {
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    setEditor(
      new Editor({
        size: { width: 500, height: 250 },
        transform: { s: 1, x: 200, y: 200 },
      }),
    );
  }, []);

  return (
    <div className="main">
      <div className="item-panel">
        <button
          onClick={() => {
            if (editor) {
              const item = new Item("TEXT");
              editor.addItem(item);
            }
          }}
        >
          Text
        </button>
      </div>
      <div className="main-content">
        <EditorView editor={editor} />
      </div>
    </div>
  );
};

export default App;

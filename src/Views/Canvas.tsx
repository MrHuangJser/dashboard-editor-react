import React, { useEffect } from "react";
import { Item } from "../core";
import { useDispatch, useMappedState } from "../utils";
import { ItemView } from "./Item";

export const Canvas = () => {
  const { size, items, editor } = useCanvasState();

  return (
    <div
      className="canvas"
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    >
      {ItemsRender(items)}
    </div>
  );
};

function ItemsRender(items: Item[]) {
  return items.map((item, index) => <ItemView key={item.id} item={item} />);
}

export function useCanvasState() {
  const dispatch = useDispatch();
  const { editor, size, items: itemList } = useMappedState(
    ({ editorInstance }) => ({
      editor: editorInstance,
      items: editorInstance.items,
      size: editorInstance.canvasSize,
    }),
  );

  useEffect(() => {
    if (editor) {
      editor.on("addItem").subscribe((res) => {
        dispatch({ type: "ADD_ITEM", payload: res });
      });
    }
  }, [editor]);

  return { editor, size, items: itemList };
}

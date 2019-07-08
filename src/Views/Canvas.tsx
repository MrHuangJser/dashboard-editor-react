import React from "react";
import { Item } from "../core";
import { useMappedState } from "../utils";
import { ItemView } from "./Item";

export const Canvas = () => {
  const { size, items } = useCanvasState();

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
  const { editor, size, items: itemList } = useMappedState(
    ({ editorInstance }) => ({
      editor: editorInstance,
      items: editorInstance.items,
      size: editorInstance.canvasSize
    })
  );

  return { editor, size, items: itemList };
}

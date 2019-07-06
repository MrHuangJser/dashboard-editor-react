import React from "react";
import { Editor } from "../core";
import { useDispatch, useMappedState } from "../utils";
import { ItemView } from "./Item";

export const Canvas = () => {
  const { size } = useCanvasState();

  return (
    <div
      className="canvas"
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    />
  );
};

function ItemsRender(editor: Editor | null) {
  console.log(editor);
  if (editor) {
    return editor.items.map((item, index) => (
      <ItemView key={item.id} item={item} />
    ));
  }
}

export function useCanvasState() {
  const dispatch = useDispatch();
  const { size } = useMappedState(({ canvasSize }) => ({ size: canvasSize }));

  return { size };
}

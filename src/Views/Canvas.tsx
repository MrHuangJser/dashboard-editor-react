import React, { useLayoutEffect, useRef } from "react";
import { Item } from "../core";
import { useMappedState } from "../utils";
import { ItemView } from "./Item";

export const Canvas = () => {
  const { size, items, domRef } = useCanvasState();

  return (
    <div
      className="canvas"
      ref={ref => {
        if (ref) {
          domRef.current = ref;
        }
      }}
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    >
      {items.map(item => (
        <ItemView key={`item-view_${item.id}`} item={item} />
      ))}
    </div>
  );
};

export function useCanvasState() {
  const domRef = useRef<HTMLElement | undefined>();
  const { editor, size, items: itemList } = useMappedState(
    ({ editorInstance }) => ({
      editor: editorInstance,
      items: editorInstance.items,
      size: editorInstance.canvasSize
    })
  );

  return { domRef, editor, size, items: itemList };
}

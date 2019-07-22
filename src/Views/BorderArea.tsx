import React from "react";
import { Item } from "../core";
import { ISize } from "../types";
import { useMappedState } from "../utils";

export const BorderArea: React.FC = () => {
  const { borderedList, scale, canvasSize } = useMappedState(({ bordered, editorInstance }) => ({
    borderedList: [...bordered],
    scale: editorInstance.canvasTransform.s,
    canvasSize: editorInstance.canvasSize
  }));

  return (
    <React.Fragment>
      {borderedList.map(bordered => (
        <ItemBordered
          key={`item-border-${bordered.id}`}
          item={bordered}
          scale={scale}
          canvasSize={canvasSize}
        />
      ))}
    </React.Fragment>
  );
};

export const ItemBordered: React.FC<{ item: Item; scale: number; canvasSize: ISize }> = ({
  item,
  scale,
  canvasSize
}) => {
  const {
    size: { width, height },
    transform: { r, x, y }
  } = item;
  return (
    <div
      className="item-border"
      style={{
        width: `${(width / canvasSize.width) * 100}%`,
        height: `${(height / canvasSize.height) * 100}%`,
        left: `${(x / canvasSize.width) * 100}%`,
        top: `${(y / canvasSize.height) * 100}%`,
        transform: `rotate(${r}deg)`
      }}
    />
  );
};

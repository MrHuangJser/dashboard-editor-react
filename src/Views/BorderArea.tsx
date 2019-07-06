import React from "react";
import { Item } from "../core";
import { useMappedState } from "../utils";

export const BorderArea: React.FC = () => {
  const { borderedList, scale } = useMappedState(
    ({ bordered, editorInstance }) => ({
      borderedList: [...bordered],
      scale: editorInstance.canvasTransform.s
    })
  );

  return (
    <React.Fragment>
      {borderedList.map(bordered => (
        <ItemBordered
          key={`item-border-${bordered.id}`}
          item={bordered}
          scale={scale}
        />
      ))}
    </React.Fragment>
  );
};

export const ItemBordered: React.FC<{ item: Item; scale: number }> = ({
  item,
  scale
}) => {
  const {
    size: { width, height },
    transform: { r, x, y }
  } = item;
  return (
    <div
      className="item-border"
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        transform: `translate3d(${x * scale}px,${y *
          scale}px,0) rotate(${r}deg)`
      }}
    />
  );
};

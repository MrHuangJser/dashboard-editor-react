import React from "react";
import { ISize, ITransform } from "../types";

export const ZoomArea: React.FC<{
  size: ISize;
  transform: ITransform;
}> = ({ size, transform: { s, x, y }, children }) => {
  return (
    <div
      className="zoom-area"
      style={{
        position: "absolute",
        transformOrigin: "0 0",
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `matrix(${s},0,0,${s},${x},${y})`,
      }}
    >
      {children}
    </div>
  );
};

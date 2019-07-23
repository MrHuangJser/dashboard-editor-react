import React from "react";
import { useMappedState } from "../utils";

export const ZoomArea: React.FC = ({ children }) => {
  const {
    size,
    transform: { s, x, y }
  } = useMappedState(({ editorInstance: { canvasSize, canvasTransform } }) => ({
    size: canvasSize,
    transform: canvasTransform
  }));

  return (
    <div
      className="zoom-area"
      style={{
        position: "absolute",
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `translate3d(${x}px,${y}px,0) scale(${s})`
      }}
    >
      {children}
    </div>
  );
};

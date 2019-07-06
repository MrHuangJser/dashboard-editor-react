import React from "react";
import { useMappedState } from "../utils";

export const NoZoomArea: React.FC = (props) => {
  const {
    size: { width, height },
    transform,
  } = useMappedState(({ editorInstance: { canvasSize, canvasTransform } }) => ({
    size: canvasSize,
    transform: canvasTransform,
  }));
  return (
    <div
      className="no-zoom-area"
      style={{
        width: `${width * transform.s}px`,
        height: `${height * transform.s}px`,
        transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
      }}
    >
      {props.children}
    </div>
  );
};

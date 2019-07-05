import React, { useMemo } from "react";
import { INoZoomAreaProps } from "../types/NoZoomArea";

export const NoZoomArea: React.FC<INoZoomAreaProps> = (props) => {
  const transform = useMemo(
    () => ({
      s: props.transform.s,
      x: props.transform.x,
      y: props.transform.y,
    }),
    [props.transform],
  );

  console.log(transform);

  return (
    <div
      className="no-zoom-area"
      style={{
        width: `${props.width * transform.s}px`,
        height: `${props.height * transform.s}px`,
        transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
      }}
    >
      {props.children}
    </div>
  );
};

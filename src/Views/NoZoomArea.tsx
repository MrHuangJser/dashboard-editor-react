import React, { useEffect, useState } from "react";
import { INoZoomAreaProps } from "../types/NoZoomArea";

export const NoZoomArea: React.FC<INoZoomAreaProps> = (props) => {
  return (
    <div
      className="no-zoom-area"
      style={{
        width: `${props.width * props.transform.s}px`,
        height: `${props.height * props.transform.s}px`,
        transform: `translate3d(${props.transform.x}px,${props.transform.y}px,0)`,
      }}
    >
      {props.children}
    </div>
  );
};

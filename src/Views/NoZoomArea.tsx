import React, { useEffect, useState } from "react";
import { INoZoomAreaProps } from "../types/NoZoomArea";

export const NoZoomArea: React.FC<INoZoomAreaProps> = (props) => {
  const { width, height } = useNoZoomAreaState(props);

  return (
    <div
      className="no-zoom-area"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${props.transform.x}px`,
        right: `${props.transform.y}px`,
      }}
    >
      {props.children}
    </div>
  );
};

export function useNoZoomAreaState(props: INoZoomAreaProps) {
  const [width, setWidth] = useState(props.width || 0);
  const [height, setHeight] = useState(props.height || 0);

  useEffect(() => {
    setWidth(width * props.transform.s);
    setHeight(height * props.transform.s);
  }, []);

  return {
    width,
    height,
  };
}

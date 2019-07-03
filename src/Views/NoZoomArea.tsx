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
        transform: `translate3d(${props.transform.x}px,${props.transform.y}px,0)`,
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
    if (props.width && props.height) {
      setWidth(props.width * props.transform.s);
      setHeight(props.height * props.transform.s);
    }
  }, [props.transform]);

  return {
    width,
    height,
  };
}

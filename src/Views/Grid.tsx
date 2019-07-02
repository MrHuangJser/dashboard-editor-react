import React, { useEffect, useState } from "react";
import { IGridProps } from "../types/Grid";

export const Grid: React.FC<IGridProps> = (props) => {
  const { width, height } = useGridState(props);

  return (
    <div className="grid-container">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width={width} height={height} patternUnits="userSpaceOnUse">
            <path
              d={`M ${width} 0 L 0 0 0 ${height}`}
              fill="none"
              stroke="rgba(207, 207, 207, 0.8)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

export function useGridState(props: IGridProps) {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);

  function setSize(size: { width?: number; height?: number }) {
    if (size.width) {
      setWidth(size.width);
    }
    if (size.height) {
      setHeight(size.height);
    }
  }

  useEffect(() => {
    if (props.scale !== undefined) {
      setSize({ width: width * props.scale, height: height * props.scale });
    }
  }, [props.scale]);

  return {
    height,
    setSize,
    width,
  };
}

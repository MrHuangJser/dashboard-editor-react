import React from "react";
import { ICanvasProps } from "../types/Canvas";

export const Canvas: React.FC<ICanvasProps> = ({ size }) => {
  return (
    <div
      className="canvas"
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    />
  );
};

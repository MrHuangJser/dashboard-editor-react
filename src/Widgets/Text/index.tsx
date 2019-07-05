import React from "react";
import { ITextProps } from "../types";

export const Text: React.FC<ITextProps> = (props) => {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <span>{props.text || "文本组件"}</span>
    </div>
  );
};

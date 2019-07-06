import React from "react";
import { ITextProps } from "../types";

const defaultProps: ITextProps = {
  textAlign: "center",
  verticalAlign: "center",
};

export const Text: React.FC<ITextProps> = (options) => {
  const props = { ...defaultProps, ...options };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: props.textAlign,
        alignItems: props.verticalAlign,
      }}
    >
      <span>{props.text || "文本组件"}</span>
    </div>
  );
};

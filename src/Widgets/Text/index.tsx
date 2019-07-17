import { JSONSchema6 } from "json-schema";
import React from "react";
import { ITextProps } from "../types";

const defaultProps: ITextProps = {
  textAlign: "center",
  verticalAlign: "center"
};

export const Text: React.FC<ITextProps> = options => {
  const props = { ...defaultProps, ...options };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: props.textAlign,
        alignItems: props.verticalAlign
      }}
    >
      <span>{props.text || "文本组件"}</span>
    </div>
  );
};

export const TextPropsScheme: JSONSchema6 = {
  type: "object",
  properties: {
    textAlign: {
      type: "string",
      title: "水平对齐",
      enum: [
        { label: "左对齐", value: "start" },
        { label: "居中对齐", value: "center" },
        { label: "右对齐", value: "end" }
      ]
    },
    verticalAlign: {
      type: "string",
      title: "垂直对齐",
      enum: [
        { label: "上对齐", value: "start" },
        { label: "居中对齐", value: "center" },
        { label: "下对齐", value: "end" }
      ]
    }
  }
};

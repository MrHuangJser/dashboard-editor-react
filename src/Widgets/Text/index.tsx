import { JSONSchema6 } from "json-schema";
import React from "react";
import { UiSchema } from "react-jsonschema-form";
import { ITextProps } from "../types";

const defaultProps: ITextProps = {
  text: "文本组件",
  textAlign: "center",
  verticalAlign: "center"
};

export default defaultProps;

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
      <span>{props.text}</span>
    </div>
  );
};

export const TextPropsSchema: JSONSchema6 = {
  properties: {
    text: { type: "string", title: "文本内容" },
    textAlign: {
      type: "string",
      title: "水平对齐",
      enum: [
        { label: "左对齐", value: "flex-start" },
        { label: "居中对齐", value: "center" },
        { label: "右对齐", value: "flex-end" }
      ]
    },
    verticalAlign: {
      type: "string",
      title: "垂直对齐",
      enum: [
        { label: "上对齐", value: "flex-start" },
        { label: "居中对齐", value: "center" },
        { label: "下对齐", value: "flex-end" }
      ]
    }
  }
};

export const TextPropsUiSchema: { [k in keyof ITextProps]: UiSchema } = {
  text: {
    "ui:widget": "StringInput",
    "ui:options": { span: 24, labelFixed: 100, size: "small" }
  },
  textAlign: {
    "ui:widget": "Select",
    "ui:options": { span: 24, labelFixed: 100, size: "small" }
  },
  verticalAlign: {
    "ui:widget": "Select",
    "ui:options": { span: 24, labelFixed: 100, size: "small" }
  }
};

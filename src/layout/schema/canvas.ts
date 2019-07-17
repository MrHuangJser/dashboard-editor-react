import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
const schema: JSONSchema6 = {
  properties: {
    width: { type: "number", title: "宽" },
    height: { type: "number", title: "高" },
    s: { type: "number", title: "缩放" },
    x: { type: "number", title: "x" },
    y: { type: "number", title: "y" }
  }
};
const uiSchema: { [key: string]: UiSchema } = {
  width: {
    "ui:widget": "InputNumber",
    "ui:options": {
      span: 12,
      size: "small",
      step: 1,
      min: 0
    }
  },
  height: {
    "ui:widget": "InputNumber",
    "ui:options": {
      span: 12,
      size: "small",
      step: 1,
      min: 0
    }
  },

  x: {
    "ui:widget": "InputNumber",
    "ui:options": { span: 12, size: "small", step: 10, min: 30, max: 400 }
  },
  y: {
    "ui:widget": "InputNumber",
    "ui:options": { span: 12, size: "small", step: 10, min: 30, max: 400 }
  },
  s: {
    "ui:widget": "InputNumber",
    "ui:options": { span: 12, size: "small", step: 10, min: 30, max: 400 }
  }
};

export const canvasSchema = { schema, uiSchema };

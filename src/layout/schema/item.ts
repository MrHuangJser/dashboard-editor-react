import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
const schema: JSONSchema6 = {
  properties: {
    size: {
      type: "object",
      properties: {
        width: { type: "number", title: "宽" },
        height: { type: "number", title: "高" }
      }
    },
    transform: {
      type: "object",
      properties: {
        r: { type: "number", title: "旋转" },
        x: { type: "number", title: "X" },
        y: { type: "number", title: "Y" }
      }
    }
  }
};
const uiSchema: { [key: string]: UiSchema } & UiSchema = {
  size: {
    "ui:options": {
      span: 24,
      hideLabel: true
    },
    "width": {
      "ui:widget": "InputNumber",
      "ui:options": {
        span: 10,
        size: "small",
        step: 1,
        min: 0,
        labelFixed: 30,
        style: { width: "100%" }
      }
    },
    "height": {
      "ui:widget": "InputNumber",
      "ui:options": {
        span: 10,
        size: "small",
        step: 1,
        min: 0,
        labelFixed: 30,
        style: { width: "100%" }
      }
    }
  },
  transform: {
    "ui:options": {
      span: 24,
      hideLabel: true
    },
    "x": {
      "ui:widget": "InputNumber",
      "ui:options": {
        span: 8,
        size: "small",
        step: 1,
        labelFixed: 30,
        style: { width: "100%" }
      }
    },
    "y": {
      "ui:widget": "InputNumber",
      "ui:options": {
        span: 8,
        size: "small",
        step: 1,
        labelFixed: 30,
        style: { width: "100%" }
      }
    },
    "r": {
      "ui:widget": "InputNumber",
      "ui:options": {
        span: 8,
        size: "small",
        step: 1,
        min: 0,
        max: 360,
        labelFixed: 30,
        style: { width: "100%" }
      }
    }
  }
};

export const itemSchema = { schema, uiSchema };

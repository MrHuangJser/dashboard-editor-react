import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
const schema: JSONSchema6 = {
  properties: {
    width: { type: "number", title: "宽" },
    height: { type: "number", title: "高" }
  }
};
const uiSchema: { [key: string]: UiSchema } & UiSchema = {
  width: {
    "ui:widget": "InputNumber",
    "ui:options": {
      span: 12,
      size: "small",
      step: 10,
      min: 0,
      labelFixed: 40
    }
  },
  height: {
    "ui:widget": "InputNumber",
    "ui:options": {
      span: 12,
      size: "small",
      step: 10,
      min: 0,
      labelFixed: 40
    }
  }
};

export const canvasSchema = { schema, uiSchema };

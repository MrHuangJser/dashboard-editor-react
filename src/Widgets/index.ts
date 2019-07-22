import { Text, TextPropsSchema } from "./Text";
import { TextPropsUiSchema } from "./Text/index";
import { ITextProps } from "./types";

export * from "./Text";
export * from "./types";

export interface IWidgetTypes {
  TEXT: ITextProps;
}

export const Widgets = {
  TEXT: Text
};

export const WidgetPropsSchemeMap = {
  TEXT: { schema: TextPropsSchema, uiSchema: TextPropsUiSchema }
};

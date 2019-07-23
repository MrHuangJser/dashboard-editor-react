import { Text, TextPropsSchema } from "./Text";
import TextProps, { TextPropsUiSchema } from "./Text/index";
import { ITextProps } from "./types";

export * from "./Text";
export * from "./types";

export interface IWidgetTypes {
  TEXT: ITextProps;
}

export const Widgets = {
  TEXT: {
    Widget: Text,
    props: TextProps
  }
};

export const WidgetPropsSchemeMap = {
  TEXT: { schema: TextPropsSchema, uiSchema: TextPropsUiSchema }
};

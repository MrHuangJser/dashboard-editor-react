import { Text, TextPropsScheme } from "./Text";
import { ITextProps } from "./types";

export * from "./types";
export * from "./Text";

export interface IWidgetTypes {
  TEXT: ITextProps;
}

export const Widgets = {
  TEXT: Text
};

export const WidgetPropsSchemeMap = {
  TEXT: TextPropsScheme
};

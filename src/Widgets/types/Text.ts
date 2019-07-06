import { IWidgetProps } from "./index";
export interface ITextProps extends IWidgetProps {
  text?: string;
  textAlign?: "start" | "center" | "end";
  verticalAlign?: "start" | "center" | "end";
}

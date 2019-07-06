import { Subject } from "rxjs";
import { IActionType } from "../types";

export type IEditorEventProps = IActionType<"addItem", "any">;

export const editorEvent = new Subject<IEditorEventProps>();

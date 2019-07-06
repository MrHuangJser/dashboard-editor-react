import { Editor, Item } from "../core";
import { ISize, ITransform } from "../types";
import { INITIAL_STATE, IState } from "./store";

export type IAction =
  | { type: "INITIAL_EDITOR"; payload: Editor }
  | { type: "SET_CANVAS_TRANSFORM"; payload: ITransform }
  | { type: "SET_CANVAS_SIZE"; payload: ISize }
  | { type: "ADD_ITEM"; payload: Item }
  | { type: "TRANSLATE_ITEM"; payload: { id: string; x: number; y: number } }
  | { type: "ROTATE_ITEM"; payload: { id: string; r: number } };

export function reducer(
  state: IState = INITIAL_STATE,
  action: IAction,
): IState {
  const { editorInstance, items } = state;
  switch (action.type) {
    case "INITIAL_EDITOR":
      return { ...state, editorInstance: action.payload };
    case "SET_CANVAS_TRANSFORM":
      if (editorInstance) {
        editorInstance.canvasTransform = action.payload;
      }
      return {
        ...state,
        canvasTransform: action.payload,
      };
    case "SET_CANVAS_SIZE":
      if (editorInstance) {
        editorInstance.canvasSize = action.payload;
      }
      return {
        ...state,
        canvasSize: action.payload,
      };
    case "ADD_ITEM":
      if (editorInstance) {
        editorInstance.items = [...items, action.payload];
      }
      return { ...state, items: editorInstance ? editorInstance.items : [] };
    case "TRANSLATE_ITEM":
      if (editorInstance) {
        editorInstance.items = items.map((item) => {
          if (item.id === action.payload.id) {
            item.transform.x = action.payload.x;
            item.transform.y = action.payload.y;
          }
          return item;
        });
      }
      return { ...state, items: editorInstance ? editorInstance.items : [] };
    default:
      return state;
  }
}

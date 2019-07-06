import { Editor, Item } from "../core";
import { ISize, ITransform } from "../types";
import { INITIAL_STATE, IState } from "./store";

export type IAction =
  | { type: "INITIAL_EDITOR"; payload: Editor }
  | { type: "SET_CANVAS_TRANSFORM"; payload: ITransform }
  | { type: "SET_CANVAS_SIZE"; payload: ISize }
  | { type: "ADD_ITEM"; payload: Item }
  | { type: "TRANSLATE_ITEM"; payload: { id: string; x: number; y: number } }
  | { type: "ROTATE_ITEM"; payload: { id: string; r: number } }
  | { type: "ADD_ITEM_BORDER"; payload: Item }
  | { type: "REMOVE_ITEM_BORDER"; payload: Item }
  | { type: "CLEAR_ITEM_BORDER"; payload: undefined };

export function reducer(
  state: IState = INITIAL_STATE,
  action: IAction
): IState {
  const { editorInstance, bordered } = state;
  const { items } = editorInstance;
  switch (action.type) {
    case "SET_CANVAS_TRANSFORM":
      editorInstance.canvasTransform = action.payload;
      break;
    case "SET_CANVAS_SIZE":
      editorInstance.canvasSize = action.payload;
      break;
    case "ADD_ITEM":
      editorInstance.items = [...items, action.payload];
      break;
    case "TRANSLATE_ITEM":
      editorInstance.items = items.map(item => {
        if (item.id === action.payload.id) {
          item.transform.x = action.payload.x;
          item.transform.y = action.payload.y;
        }
        return item;
      });
      break;
    case "ADD_ITEM_BORDER":
      bordered.add(action.payload);
      break;
    case "REMOVE_ITEM_BORDER":
      bordered.delete(action.payload);
      break;
    case "CLEAR_ITEM_BORDER":
      bordered.clear();
      break;
  }
  return { ...state };
}

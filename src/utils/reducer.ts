import { Item } from "../core";
import { ISize, ITransform } from "../types";
import { INITIAL_STATE, IState } from "./store";

export type IAction =
  | { type: "SET_CANVAS_TRANSFORM"; payload: ITransform }
  | { type: "SET_CANVAS_SIZE"; payload: ISize }
  | { type: "ADD_ITEM"; payload: Item }
  | {
      type: "TRANSLATE_ITEM";
      payload: Array<{
        id: string;
        x?: number;
        y?: number;
        r?: number;
        width?: number;
        height?: number;
      }>;
    }
  | { type: "ROTATE_ITEM"; payload: { id: string; r: number } }
  | { type: "ADD_ITEM_BORDER"; payload: Item }
  | { type: "REMOVE_ITEM_BORDER"; payload: Item }
  | { type: "CLEAR_ITEM_BORDER"; payload: undefined }
  | { type: "SELECT_ITEM"; payload: Item };

export function reducer(
  state: IState = INITIAL_STATE,
  action: IAction
): IState {
  const { editorInstance, bordered, selected } = state;
  const { items } = editorInstance;
  switch (action.type) {
    case "SET_CANVAS_TRANSFORM":
      editorInstance.canvasTransform = action.payload;
      break;
    case "SET_CANVAS_SIZE":
      editorInstance.canvasSize = action.payload;
      break;
    case "ADD_ITEM":
      selected.clear();
      state.bordered.clear();
      editorInstance.items = [...items, action.payload];
      break;
    case "TRANSLATE_ITEM":
      editorInstance.items = items.map(item => {
        if (Array.isArray(action.payload)) {
          const itemIndex = action.payload.findIndex(i => item.id === i.id);
          if (itemIndex !== -1) {
            item.transform.r =
              action.payload[itemIndex].r !== undefined
                ? action.payload[itemIndex].r!
                : item.transform.r;
            item.transform.x =
              action.payload[itemIndex].x !== undefined
                ? action.payload[itemIndex].x!
                : item.transform.x;
            item.transform.y =
              action.payload[itemIndex].y !== undefined
                ? action.payload[itemIndex].y!
                : item.transform.y;
            item.size.width =
              action.payload[itemIndex].width !== undefined
                ? action.payload[itemIndex].width!
                : item.size.width;
            item.size.height =
              action.payload[itemIndex].height !== undefined
                ? action.payload[itemIndex].height!
                : item.size.height;
          }
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
    case "SELECT_ITEM":
      bordered.clear();
      selected.clear();
      bordered.add(action.payload);
      selected.add(action.payload);
      break;
  }
  return { ...state };
}

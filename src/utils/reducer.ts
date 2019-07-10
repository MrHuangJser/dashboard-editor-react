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
  | { type: "ADD_ITEM_BORDER"; payload: Item[] }
  | { type: "REMOVE_ITEM_BORDER"; payload: Item[] }
  | { type: "CLEAR_ITEM_BORDER"; payload?: undefined }
  | { type: "CLEAR_ITEM_SELECT"; payload?: undefined }
  | { type: "SELECT_ITEM"; payload: Item | Item[] }
  | { type: "UN_SELECT_ITEM"; payload: Item }
  | { type: "DELETE_ITEM"; payload: Item[] }
  | { type: "GROUP_ITEM"; payload: Item[] }
  | { type: "UN_GROUP_ITEM"; payload: string };

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
      action.payload.forEach(item => {
        bordered.add(item);
      });
      break;
    case "REMOVE_ITEM_BORDER":
      action.payload.forEach(item => {
        bordered.delete(item);
      });
      break;
    case "CLEAR_ITEM_BORDER":
      bordered.clear();
      break;
    case "CLEAR_ITEM_SELECT":
      bordered.clear();
      selected.clear();
      break;
    case "SELECT_ITEM":
      if (Array.isArray(action.payload)) {
        action.payload.forEach(item => {
          bordered.add(item);
          selected.add(item);
        });
      } else {
        bordered.add(action.payload);
        selected.add(action.payload);
      }
      break;
    case "UN_SELECT_ITEM":
      bordered.delete(action.payload);
      selected.delete(action.payload);
      break;
    case "DELETE_ITEM":
      action.payload.forEach(item => {
        bordered.delete(item);
        selected.delete(item);
        editorInstance.items = editorInstance.items.filter(
          i => i.id !== item.id
        );
      });
      break;
    case "GROUP_ITEM":
      const groupId = `group_${Date.now()}_${Math.round(
        Math.random() * 100000
      )}`;
      editorInstance.items = editorInstance.items.map(item => {
        if (action.payload.findIndex(i => item.id === i.id) !== -1) {
          item.groupId = groupId;
        }
        return item;
      });
      break;
    case "UN_GROUP_ITEM":
      editorInstance.items = editorInstance.items.map(item => {
        if (item.groupId === action.payload) {
          item.groupId = undefined;
        }
        return item;
      });
      break;
  }
  return { ...state };
}

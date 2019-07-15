import { Item } from "../core";
import { IEventTypes } from "../types";
import { INITIAL_STATE, IState } from "./store";

type K = keyof IEventTypes;

export function reducer(
  state: IState = INITIAL_STATE,
  action: { type: K; payload?: IEventTypes[K] }
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
      action.payload.forEach((item: Item) => {
        bordered.add(item);
      });
      break;
    case "REMOVE_ITEM_BORDER":
      action.payload.forEach((item: Item) => {
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
      if (Array.isArray(action.payload)) {
        action.payload.forEach(item => {
          bordered.delete(item);
          selected.delete(item);
        });
      } else {
        bordered.delete(action.payload);
        selected.delete(action.payload);
      }
      break;
    case "DELETE_ITEM":
      action.payload.forEach((item: Item) => {
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
        if (action.payload.findIndex((i: Item) => item.id === i.id) !== -1) {
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
  editorInstance.selected = selected;
  return { ...state };
}

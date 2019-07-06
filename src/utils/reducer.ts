import { Editor, Item } from "../core";
import { ISize, ITransform } from "../types";
import { INITIAL_STATE, IState } from "./store";

export type IAction =
  | { type: "INITIAL_EDITOR"; payload: Editor }
  | { type: "SET_CANVAS_TRANSFORM"; payload: ITransform }
  | { type: "SET_CANVAS_SIZE"; payload: ISize }
  | { type: "ADD_ITEM"; payload: Item };

export function reducer(
  state: IState = INITIAL_STATE,
  action: IAction,
): IState {
  const { items } = state;
  switch (action.type) {
    case "INITIAL_EDITOR":
      return { ...state, editorInstance: action.payload };
    case "SET_CANVAS_TRANSFORM":
      return {
        ...state,
        canvasTransform: action.payload,
      };
    case "SET_CANVAS_SIZE":
      return {
        ...state,
        canvasSize: action.payload,
      };
    case "ADD_ITEM":
      const newItems = [...items, action.payload];
      if (state.editorInstance) {
        state.editorInstance.items = newItems;
      }
      return { ...state, items: newItems };
    default:
      return state;
  }
}

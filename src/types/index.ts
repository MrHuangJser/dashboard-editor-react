import { Item } from "../core";
import { ISize, ITransform } from "./Editor";

export * from "./ContextMenu";
export * from "./Editor";

export interface IActionType<T, P> {
  type?: T;
  payload: P;
}

export interface IEventTypes {
  SET_CANVAS_TRANSFORM: ITransform;
  SET_CANVAS_SIZE: ISize;
  ADD_ITEM: Item;
  TRANSLATE_ITEM: Array<{
    id: string;
    x?: number;
    y?: number;
    r?: number;
    width?: number;
    height?: number;
  }>;
  ROTATE_ITEM: { id: string; r: number };
  ADD_ITEM_BORDER: Item[];
  REMOVE_ITEM_BORDER: Item[];
  CLEAR_ITEM_BORDER: any | undefined;
  CLEAR_ITEM_SELECT: any | undefined;
  SELECT_ITEM: Item | Item[];
  UN_SELECT_ITEM: Item[];
  DELETE_ITEM: Item[];
  GROUP_ITEM: string;
  UN_GROUP_ITEM: string;
}

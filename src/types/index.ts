import { Item } from "../core";
import { ISize, ITransform } from "./Editor";

export * from "./ContextMenu";
export * from "./Editor";

export interface IEventTypes {
  SET_CANVAS_TRANSFORM: ITransform;
  SET_CANVAS_SIZE: ISize;
  ADD_ITEM: Item;
  ROTATE_ITEM: { item: Item; r: number };
  ADD_ITEM_BORDER: Item[];
  REMOVE_ITEM_BORDER: Item[];
  CLEAR_ITEM_BORDER: undefined;
  CLEAR_ITEM_SELECT: undefined;
  SELECT_ITEM: Item;
  UN_SELECT_ITEM: Item | Item[];
  DELETE_ITEM: Item[];
  GROUP_ITEM: Item[];
  UN_GROUP_ITEM: string;
  SELECT_GROUP: string;
  MOVE_ITEM: { items: Item[]; mx: number; my: number };
  RESIZE_ITEM: Array<{ item: Item; size: ISize }>;
}

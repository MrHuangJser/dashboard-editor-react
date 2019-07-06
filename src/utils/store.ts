import { createStore, Store } from "redux";
import { create } from "redux-react-hook";
import { Editor, Item } from "../core";
import { ISize, ITransform } from "../types";
import { IAction, reducer } from "./reducer";

export interface IState {
  editorInstance: Editor | null;
  canvasSize: ISize;
  canvasTransform: ITransform;
  items: Item[];
}

export const INITIAL_STATE: IState = {
  editorInstance: null,
  canvasSize: { width: 800, height: 400 },
  canvasTransform: { s: 1, x: 0, y: 0 },
  items: [],
};

export function makeStore(state?: any): Store<IState, IAction> {
  return createStore(reducer, { ...INITIAL_STATE, ...state });
}
export const { StoreContext, useDispatch, useMappedState } = create<
  IState,
  IAction,
  Store<IState, IAction>
>();

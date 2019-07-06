import { createStore, Store } from "redux";
import { create } from "redux-react-hook";
import { Editor, Item } from "../core";
import { IAction, reducer } from "./reducer";

export interface IState {
  editorInstance: Editor;
  bordered: Set<Item>;
  selected: Set<Item>;
}

export const INITIAL_STATE: IState = {
  editorInstance: new Editor(),
  bordered: new Set(),
  selected: new Set()
};

export function makeStore(state?: any): Store<IState, IAction> {
  return createStore(reducer, { ...INITIAL_STATE, ...state });
}
export const { StoreContext, useDispatch, useMappedState } = create<
  IState,
  IAction,
  Store<IState, IAction>
>();

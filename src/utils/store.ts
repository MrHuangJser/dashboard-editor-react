import { createStore, Dispatch, Store } from "redux";
import { create } from "redux-react-hook";
import { Editor, Item } from "../core";
import { IEventTypes } from "../types";
import { reducer } from "./reducer";

export interface IState {
  editorInstance: Editor;
  bordered: Set<Item>;
  selected: Set<Item>;
}

interface IActionType {
  type: keyof IEventTypes;
  payload: IEventTypes[IActionType["type"]];
}

export const INITIAL_STATE: IState = {
  editorInstance: new Editor(),
  bordered: new Set(),
  selected: new Set()
};

export function makeStore<K extends keyof IEventTypes>(
  state?: any
): Store<IState, { type: K; payload: IEventTypes[K] }> {
  return createStore<IState, any, IState, IState>(reducer, { ...INITIAL_STATE, ...state });
}
export const { StoreContext, useMappedState, useDispatch: useStoreDispatch } = create<
  IState,
  IActionType,
  Store<IState, IActionType>,
  Dispatch<IActionType>
>();

export function useDispatch() {
  const { editor } = useMappedState(({ editorInstance }) => ({
    editor: editorInstance
  }));
  return function a<K extends keyof IEventTypes>(params: { type: K; payload: IEventTypes[K] }) {
    editor.emit(params);
  };
}

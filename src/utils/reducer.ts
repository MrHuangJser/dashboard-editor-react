import { IEventTypes } from "../types";
import actions from "./action";
import { INITIAL_STATE, IState } from "./store";

export function reducer<K extends keyof IEventTypes>(
  state: IState | undefined = INITIAL_STATE,
  action: { type: K; payload: IEventTypes[K] }
): IState {
  const actionFunc: (state: IState, payload: any) => void = actions[action.type];
  if (actionFunc) {
    actionFunc(state, action.payload);
  }
  return { ...state };
}

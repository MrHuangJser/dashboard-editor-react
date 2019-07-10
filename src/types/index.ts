export * from "./Editor";
export * from "./ContextMenu";

export interface IActionType<T, P> {
  type?: T;
  payload: P;
}

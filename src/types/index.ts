export interface IActionType<T, P> {
  type?: T;
  payload: P;
}

export * from "./Editor";
export * from "./Grid";
export * from "./NoZoomArea";
export * from "./Canvas";

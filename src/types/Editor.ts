export interface IActionType<T, P> {
  type: T;
  payload: P;
}

export type EditorTransformActionType =
  | IActionType<"SET_SCALE", number>
  | IActionType<"SET_X", number>
  | IActionType<"SET_Y", number>;

export type EditorSizeActionType =
  | IActionType<"SET_WIDTH", number>
  | IActionType<"SET_HEIGHT", number>;

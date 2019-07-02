export interface ActionType<T, P> {
  type: T;
  payload: P;
}

export type EditorTransformActionType =
  | ActionType<'SET_SCALE', number>
  | ActionType<'SET_X', number>
  | ActionType<'SET_Y', number>;

export type EditorSizeActionType =
  | ActionType<'SET_WIDTH', number>
  | ActionType<'SET_HEIGHT', number>;

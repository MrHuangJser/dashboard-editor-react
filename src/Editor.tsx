import React, { useReducer } from "react";
import { EditorSizeActionType, EditorTransformActionType } from "./types/Editor";
import { ISize, ITransform } from "./types/index";
import { Grid } from "./Views/Grid";
import { NoZoomArea } from "./Views/NoZoomArea";

const Editor: React.FC<{}> = () => {
  const { size, transform } = useEditorState();

  return (
    <div className="editor-container">
      <NoZoomArea width={size.width} height={size.height} transform={transform}>
        <Grid scale={transform.s} />
      </NoZoomArea>
    </div>
  );
};

export default Editor;

export function useEditorState() {
  const [size, sizeDispatch] = useReducer(sizeReducer, { width: 800, height: 600 });
  const [transform, transformDispatch] = useReducer(transformReducer, {
    s: 1,
    x: 0,
    y: 0,
  });

  return {
    size,
    sizeDispatch,
    transform,
    transformDispatch,
  };
}

export function sizeReducer(state: ISize, action: EditorSizeActionType): ISize {
  switch (action.type) {
    case "SET_HEIGHT":
      return { ...state, height: action.payload };
    case "SET_WIDTH":
      return { ...state, width: action.payload };
    default:
      return state;
  }
}

export function transformReducer(
  state: ITransform,
  action: EditorTransformActionType,
): ITransform {
  switch (action.type) {
    case "SET_SCALE":
      return { ...state, s: action.payload };
    case "SET_X":
      return { ...state, x: action.payload };
    case "SET_Y":
      return { ...state, y: action.payload };
    default:
      return state;
  }
}

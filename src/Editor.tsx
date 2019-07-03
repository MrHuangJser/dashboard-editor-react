import React, { useReducer, useRef } from "react";
import { ZoomWrap } from "./Components/Zoom";
import { EditorSizeActionType, EditorTransformActionType } from "./types/Editor";
import { ISize, ITransform } from "./types/index";
import { Grid } from "./Views/Grid";
import { NoZoomArea } from "./Views/NoZoomArea";

const Editor: React.FC<{}> = () => {
  const { editorContainerRef, size, transform, transformDispatch } = useEditorState();
  return (
    <ZoomWrap
      onZoom={(s, x, y) => {
        console.log(s, x, y);
      }}
    >
      <div
        className="editor-container"
        ref={(ref) => {
          if (ref) {
            editorContainerRef.current = ref;
          }
        }}
      >
        <NoZoomArea width={size.width} height={size.height} transform={transform}>
          <Grid scale={transform.s} />
        </NoZoomArea>
      </div>
    </ZoomWrap>
  );
};

export default Editor;

export function useEditorState() {
  const editorContainerRef = useRef<HTMLElement>();
  const [size, sizeDispatch] = useReducer(sizeReducer, { width: 800, height: 400 });
  const [transform, transformDispatch] = useReducer(transformReducer, {
    s: 1,
    x: 0,
    y: 0,
  });

  return {
    editorContainerRef,
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
    case undefined:
      return (action.payload as ITransform) || state;
  }
}

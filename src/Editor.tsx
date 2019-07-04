import React, { useReducer, useRef, useState } from "react";
import { useDragState } from "./Components/Drag";
import { useZoomState } from "./Components/Zoom";
import { EditorSizeActionType, EditorTransformActionType } from "./types/Editor";
import { ISize, ITransform } from "./types/index";
import { Canvas } from "./Views/Canvas";
import { Grid } from "./Views/Grid";
import { NoZoomArea } from "./Views/NoZoomArea";

const defaultTransform = { s: 1, x: 0, y: 0 };

const Editor: React.FC<{}> = () => {
  const { editorContainerRef, size } = useEditorState();
  const [transform, setTransform] = useState<ITransform>(defaultTransform);

  useZoomState({
    transform,
    intensity: 0.1,
    domRef: editorContainerRef,
    onZoom: (trans) => setTransform(trans),
  });

  useDragState({
    useSpace: true,
    domRef: editorContainerRef,
    onDrag: (e) => {
      console.log(e);
    },
  });

  return (
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
      <Canvas />
    </div>
  );
};

export default Editor;

export function useEditorState() {
  const editorContainerRef = useRef<HTMLElement>();
  const [size, sizeDispatch] = useReducer(sizeReducer, {
    width: 800,
    height: 400,
  });
  const [transform, transformDispatch] = useReducer(transformReducer, defaultTransform);

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
    case "SET_SIZE":
      return { ...action.payload };
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

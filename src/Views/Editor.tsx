import React, { useEffect, useRef, useState } from "react";
import { useDragState } from "../components/Drag";
import { useZoomState } from "../components/Zoom";
import { Editor } from "../core";
import { makeStore, StoreContext, useDispatch, useMappedState } from "../utils";
import { Canvas } from "./Canvas";
import { Grid } from "./Grid";
import { NoZoomArea } from "./NoZoomArea";
import { SelectAreaView } from "./SelectArea";
import { ZoomArea } from "./ZoomArea";

let pointerStart: [number, number] | null = null;

export const Content: React.FC = () => {
  const { editorContainerRef } = useEditorState();

  return (
    <div
      className="editor-container"
      ref={(ref) => {
        if (ref) {
          editorContainerRef.current = ref;
        }
      }}
    >
      <NoZoomArea>
        <Grid />
      </NoZoomArea>
      <ZoomArea>
        <Canvas />
      </ZoomArea>
      <SelectAreaView domRef={editorContainerRef} />
    </div>
  );
};

export const EditorView = (props: { editor: Editor | null }) => {
  const [store, setStore] = useState(makeStore());

  useEffect(() => {
    if (props.editor) {
      setStore(makeStore({ editorInstance: props.editor }));
    }
  }, [props.editor]);

  return (
    <StoreContext.Provider value={store}>
      <Content />
    </StoreContext.Provider>
  );
};

export function useEditorState() {
  const editorContainerRef = useRef<HTMLElement>();
  const dispatch = useDispatch();
  const { transform } = useMappedState((state) => ({
    transform: state.canvasTransform,
  }));

  const zoomTrans = useZoomState({
    transform,
    intensity: 0.1,
    domRef: editorContainerRef,
  });

  const { moveState, dragStatus } = useDragState({
    domRef: editorContainerRef,
    useSpace: true,
  });

  useEffect(() => {
    const { s, ox, oy } = zoomTrans;
    dispatch({
      type: "SET_CANVAS_TRANSFORM",
      payload: { s, x: transform.x + ox, y: transform.y + oy },
    });
  }, [zoomTrans]);

  useEffect(() => {
    if (dragStatus) {
      pointerStart = [transform.x, transform.y];
    } else {
      pointerStart = null;
    }
  }, [dragStatus]);

  useEffect(() => {
    if (pointerStart) {
      dispatch({
        type: "SET_CANVAS_TRANSFORM",
        payload: {
          ...transform,
          x: pointerStart[0] + moveState.mx,
          y: pointerStart[1] + moveState.my,
        },
      });
    }
  }, [moveState]);

  return { editorContainerRef };
}

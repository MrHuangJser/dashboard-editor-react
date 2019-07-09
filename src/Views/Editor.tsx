import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { useDragState, useZoomState } from "../components";
import { Editor } from "../core";
import {
  INITIAL_STATE,
  makeStore,
  StoreContext,
  useDispatch,
  useMappedState
} from "../utils";
import { BorderArea } from "./BorderArea";
import { Canvas } from "./Canvas";
import { Grid } from "./Grid";
import { NoZoomArea } from "./NoZoomArea";
import { ResizeHandle } from "./ResizeHandle";
import { SelectAreaView } from "./SelectArea";
import { ZoomArea } from "./ZoomArea";

let pointerStart: [number, number] | null = null;

export const Content: React.FC = () => {
  const { editorContainerRef, clearState } = useEditorState();

  return (
    <div
      className="editor-container"
      ref={ref => {
        if (ref) {
          editorContainerRef.current = ref;
        }
      }}
      onPointerDown={() => clearState()}
    >
      <NoZoomArea>
        <Grid />
      </NoZoomArea>
      <ZoomArea>
        <Canvas />
      </ZoomArea>
      <NoZoomArea>
        <BorderArea />
        <ResizeHandle />
      </NoZoomArea>
      <SelectAreaView domRef={editorContainerRef} />
    </div>
  );
};

export const EditorView = (props: { editor: Editor | null }) => {
  const [store, setStore] = useState(makeStore(INITIAL_STATE));

  useEffect(() => {
    if (props.editor) {
      setStore(
        makeStore({
          editorInstance: props.editor,
          canvasSize: props.editor.canvasSize,
          canvasTransform: props.editor.canvasTransform
        })
      );
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
  const { transform, editor } = useMappedState(state => ({
    transform: state.editorInstance.canvasTransform,
    editor: state.editorInstance
  }));

  const zoomTrans = useZoomState({
    transform,
    intensity: 0.1,
    domRef: editorContainerRef
  });

  const { moveState, dragStatus } = useDragState({
    domRef: editorContainerRef,
    useSpace: true
  });

  useEffect(() => {
    let event: Subscription;
    if (editor) {
      event = editor.bus.subscribe(res => {
        dispatch(res);
      });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [editor]);

  useEffect(() => {
    const { s, ox, oy } = zoomTrans;
    dispatch({
      type: "SET_CANVAS_TRANSFORM",
      payload: { s, x: transform.x + ox, y: transform.y + oy }
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
          y: pointerStart[1] + moveState.my
        }
      });
    }
  }, [moveState]);

  return {
    editorContainerRef,
    clearState: () => dispatch({ type: "CLEAR_ITEM_SELECT" })
  };
}

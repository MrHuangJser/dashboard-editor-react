import React, { Fragment, useEffect, useRef, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { useDragState, useZoomState } from "../Components";
import { Editor } from "../core";
import { IContextMenuProps } from "../types/ContextMenu";
import {
  ContextMenuContext,
  INITIAL_STATE,
  makeStore,
  StoreContext,
  useDispatch,
  useMappedState,
  useStoreDispatch
} from "../utils";
import { BorderArea } from "./BorderArea";
import { Canvas } from "./Canvas";
import { ContextMenu } from "./ContextMenu";
import { Grid } from "./Grid";
import { NoZoomArea } from "./NoZoomArea";
import { ResizeHandle } from "./ResizeHandle";
import { SelectAreaView } from "./SelectArea";
import { ZoomArea } from "./ZoomArea";

export const Content: React.FC = () => {
  const { editorContainerRef, contextMenuProps, setContextMenuProps, editor } = useEditorState();

  return (
    <Fragment>
      <div
        className="editor-container"
        ref={ref => {
          if (ref) {
            editor.editorView = ref;
            editorContainerRef.current = ref;
          }
        }}
      >
        <ContextMenuContext.Provider value={{ setContextMenuProps }}>
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
        </ContextMenuContext.Provider>
      </div>
      {contextMenuProps ? <ContextMenu {...contextMenuProps} /> : ""}
    </Fragment>
  );
};

let pointerStart: [number, number] | null = null;

export function useEditorState() {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const storeDispatch = useStoreDispatch();
  const dispatch = useDispatch();
  const { transform, editor, size } = useMappedState(state => ({
    transform: state.editorInstance.canvasTransform,
    size: state.editorInstance.canvasSize,
    editor: state.editorInstance
  }));
  const [contextMenuProps, setContextMenuProps] = useState<IContextMenuProps>();

  useEffect(() => {
    let event: Subscription;
    if (editorContainerRef.current) {
      event = fromEvent<MouseEvent>(editorContainerRef.current, "mousedown").subscribe(() => {
        dispatch({ type: "CLEAR_ITEM_SELECT", payload: undefined });
        setContextMenuProps(undefined);
      });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  });

  const zoomTrans = useZoomState({
    transform,
    size,
    intensity: 0.05,
    domRef: editorContainerRef
  });

  const [moveStatus] = useDragState({
    domRef: editorContainerRef,
    useSpace: true
  });

  useEffect(() => {
    if (moveStatus) {
      switch (moveStatus.status) {
        case "drag-start":
          pointerStart = [transform.x, transform.y];
          break;
        case "drag-move":
          if (pointerStart) {
            const { mx, my } = moveStatus;
            dispatch({
              type: "SET_CANVAS_TRANSFORM",
              payload: { ...transform, x: pointerStart[0] + mx, y: pointerStart[1] + my }
            });
          }
          break;
        case "drag-end":
          pointerStart = null;
          break;
      }
    }
  }, [moveStatus]);

  useEffect(() => {
    let event: Subscription;
    if (editorContainerRef.current) {
      event = fromEvent<MouseEvent>(document, "contextmenu").subscribe(e => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [editorContainerRef.current]);

  useEffect(() => {
    let event: Subscription;
    if (editor) {
      event = editor.bus.subscribe(res => {
        storeDispatch(res);
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
    const scale = transform.s + s;
    if (scale >= 0.05 && scale <= 4) {
      dispatch({
        type: "SET_CANVAS_TRANSFORM",
        payload: { s: transform.s + s, x: transform.x + ox, y: transform.y + oy }
      });
    }
  }, [zoomTrans]);

  return {
    editor,
    editorContainerRef,
    contextMenuProps,
    setContextMenuProps
  };
}

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

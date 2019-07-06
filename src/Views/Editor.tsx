import React, { useEffect, useRef, useState } from "react";
import { useDragState } from "../components/Drag";
import { useZoomState } from "../components/Zoom";
import { Editor } from "../core";
import { ISize, ITransform } from "../types";
import { Canvas } from "./Canvas";
import { Grid } from "./Grid";
import { NoZoomArea } from "./NoZoomArea";
import { SelectAreaView } from "./SelectArea";
import { ZoomArea } from "./ZoomArea";

const defaultTransform = { s: 1, x: 0, y: 0 };
let pointerStart: [number, number] | null = null;

export const EditorView: React.FC<{ editor: Editor | null }> = () => {
  const { editorContainerRef, size, transform } = useEditorState();

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
      <ZoomArea size={size} transform={transform}>
        <Canvas size={size} />
      </ZoomArea>
      <SelectAreaView domRef={editorContainerRef} />
    </div>
  );
};

export function useEditorState() {
  const editorContainerRef = useRef<HTMLElement>();
  const [size, setSize] = useState<ISize>({
    width: 800,
    height: 400,
  });
  const [transform, setTransform] = useState<ITransform>(defaultTransform);

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
    setTransform({ s, x: transform.x + ox, y: transform.y + oy });
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
      setTransform({
        ...transform,
        x: pointerStart[0] + moveState.mx,
        y: pointerStart[1] + moveState.my,
      });
    }
  }, [moveState]);

  return {
    editorContainerRef,
    size,
    setSize,
    transform,
    setTransform,
  };
}
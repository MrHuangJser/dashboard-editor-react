import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import TextIcon from "../assets/text.svg";
import { Editor, Item } from "../core";
import { ISize } from "../types";
import { IWidgetTypes, Widgets } from "../widgets";

const moveEvent = fromEvent<PointerEvent>(window, "pointermove");
const upEvent = fromEvent<PointerEvent>(window, "pointerup");

export const ItemPanel: FC<{ editor: Editor | null }> = ({ editor }) => {
  return (
    <div className="item-panel">
      <ItemIcon editor={editor} type="TEXT" size={{ width: 100, height: 50 }} />
    </div>
  );
};

export const ItemIcon: FC<{ editor: Editor | null; type: keyof IWidgetTypes; size: ISize }> = ({
  editor,
  type,
  size
}) => {
  const { domRef, previewPosition, scale } = useItemIconState(editor, type);
  const Widget = Widgets[type];
  return (
    <Fragment>
      <div className="item-icon">
        <a
          title="文本组件"
          ref={ref => {
            if (ref) {
              domRef.current = ref;
            }
          }}
        >
          <TextIcon className="svg-icon" />
        </a>
      </div>
      {previewPosition ? (
        <div
          style={{
            ...size,
            transformOrigin: "0 0",
            transform: `scale(${scale})`,
            display: "block",
            position: "fixed",
            zIndex: 99,
            left: Math.round(previewPosition.x),
            top: Math.round(previewPosition.y),
            border: "1px solid #298df8",
            boxSizing: "border-box"
          }}
        >
          {<Widget />}
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export function useItemIconState(editor: Editor | null, type: keyof IWidgetTypes) {
  const domRef = useRef<HTMLElement | undefined>();
  const [previewPosition, setPreview] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    let event: Subscription;
    if (domRef.current) {
      event = fromEvent<PointerEvent>(domRef.current, "pointerdown")
        .pipe(switchMap(() => moveEvent.pipe(takeUntil(upEvent.pipe(map(e => up(e)))))))
        .subscribe(e => setPreview({ x: e.clientX, y: e.clientY }));
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [domRef, editor]);

  function up(e: PointerEvent) {
    setPreview(null);
    const editorDom: HTMLElement | null = document.querySelector(".editor-content");
    if (editorDom && editor) {
      const { s, x, y } = editor.canvasTransform;
      const { left, top, width, height } = editorDom.getBoundingClientRect();
      if (left < e.clientX && top < e.clientY && left + width > e.clientX && top + height > e.clientY) {
        const item = new Item(type);
        item.transform.x = (e.clientX - left - x) / s;
        item.transform.y = (e.clientY - top - y) / s;
        editor.emit({ type: "ADD_ITEM", payload: item });
      }
    }
  }

  return { domRef, previewPosition, scale: editor ? editor.canvasTransform.s : 1 };
}

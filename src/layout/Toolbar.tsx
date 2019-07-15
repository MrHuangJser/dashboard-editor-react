import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { delay } from "rxjs/operators";
import { EditorContext } from "../App";
import BottomAlign from "../assets/bottom-align.svg";
import Break from "../assets/break.svg";
import Group from "../assets/group.svg";
import HorizontalAlign from "../assets/horizontal-align.svg";
import HorizontalBetween from "../assets/horizontal-between.svg";
import LeftAlign from "../assets/left-align.svg";
import LeftArrow from "../assets/left-arrow.svg";
import Plus from "../assets/plus.svg";
import RightAlign from "../assets/right-align.svg";
import Subtract from "../assets/subtract.svg";
import TopAlign from "../assets/top-align.svg";
import VerticalAlign from "../assets/vertical-align.svg";
import VerticalBetween from "../assets/vertical-between.svg";
import { Item } from "../editor";

export const Toolbar: FC = () => {
  const {
    scale,
    setScale,
    editor,
    items,
    toolbarStatus: { hasSelected, isGroup, canGroup }
  } = useToolbarState();
  const className = `toolbar-item ${hasSelected ? "" : "disabled"}`;

  return (
    <div className="toolbar">
      <div className="title">
        <div className="action">
          <LeftArrow className="svg-icon" width={12} height={12} />
        </div>
        <div className="title-content">测试画面</div>
      </div>
      <div className="toolbar-center">
        <div>
          <a className={className} title="左对齐">
            <div className="icon">
              <LeftAlign className="svg-icon" />
            </div>
          </a>
          <a className={className} title="右对齐">
            <div className="icon">
              <RightAlign className="svg-icon" />
            </div>
          </a>
          <a className={className} title="上对齐">
            <div className="icon">
              <TopAlign className="svg-icon" />
            </div>
          </a>
          <a className={className} title="下对齐">
            <div className="icon">
              <BottomAlign className="svg-icon" />
            </div>
          </a>
          <a className={className} title="垂直对齐">
            <div className="icon">
              <VerticalAlign className="svg-icon" />
            </div>
          </a>
          <a className={className} title="水平对齐">
            <div className="icon">
              <HorizontalAlign className="svg-icon" />
            </div>
          </a>
          <a
            className={`toolbar-item ${canGroup ? "" : "disabled"}`}
            title="水平分布"
          >
            <div className="icon">
              <HorizontalBetween className="svg-icon" />
            </div>
          </a>
          <a
            className={`toolbar-item ${canGroup ? "" : "disabled"}`}
            title="垂直分布"
          >
            <div className="icon">
              <VerticalBetween className="svg-icon" />
            </div>
          </a>
        </div>
        <div>
          <a
            className={`toolbar-item ${canGroup ? "" : "disabled"}`}
            title="组合"
            onClick={() => {
              if (canGroup && editor) {
                editor.emit({ type: "GROUP_ITEM", payload: items });
              }
            }}
          >
            <div className="icon">
              <Group className="svg-icon" />
            </div>
          </a>
          <a
            className={`toolbar-item ${isGroup ? "" : "disabled"}`}
            title="打散"
          >
            <div className="icon">
              <Break className="svg-icon" />
            </div>
          </a>
        </div>
        <div>
          <div className="zoom-button-group">
            <Subtract className="svg-icon" />
            <a onDoubleClick={() => setScale(100)}>
              {Math.round(scale.current)}%
            </a>
            <Plus className="svg-icon" />
          </div>
        </div>
      </div>
      <div className="toolbar-right" />
    </div>
  );
};

export function useToolbarState() {
  const editor = useContext(EditorContext);
  const scale = useRef<number>(100);
  const [items, setItems] = useState<Item[]>([]);
  const [toolbarStatus, setStatus] = useState({
    isGroup: false,
    hasSelected: false,
    canGroup: false
  });

  useEffect(() => {
    let event: Subscription;
    if (editor) {
      event = editor
        .on([
          "SELECT_ITEM",
          "CLEAR_ITEM_SELECT",
          "UN_SELECT_ITEM",
          "DELETE_ITEM",
          "SET_CANVAS_TRANSFORM"
        ])
        .pipe(delay(10))
        .subscribe(() => {
          setItems([...editor.selected]);
          scale.current = editor.canvasTransform.s * 100;
        });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [editor]);

  useEffect(() => {
    if (items.length) {
      if (items.length > 1) {
        if (items[0].groupId) {
          setStatus({ canGroup: false, isGroup: true, hasSelected: true });
        } else {
          setStatus({ canGroup: true, isGroup: false, hasSelected: true });
        }
      } else {
        setStatus({ canGroup: false, isGroup: false, hasSelected: true });
      }
    } else {
      setStatus({ isGroup: false, canGroup: false, hasSelected: false });
    }
  }, [items]);

  const setScale = (s: number) => {
    if (editor) {
      const { x, y } = editor.canvasTransform;
      editor.emit({
        type: "SET_CANVAS_TRANSFORM",
        payload: { s: s / 100, x, y }
      });
    }
  };

  return { toolbarStatus, items, scale, setScale, editor };
}

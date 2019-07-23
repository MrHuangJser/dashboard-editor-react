import { Icon } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { delay } from "rxjs/operators";
import { Group } from "../core/group";
import { Editor, Item } from "../editor";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1310204_21qcnamjaw6.js"
});

export type IAlignDirection =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "vertical"
  | "horizontal"
  | "vertical-between"
  | "horizontal-between";

export const Toolbar: FC<{ editor: Editor | null }> = ({ editor }) => {
  const {
    scale,
    setScale,
    setAlign,
    items,
    groupId,
    toolbarStatus: { hasSelected, isGroup, canGroup }
  } = useToolbarState(editor);
  const className = `toolbar-item ${hasSelected ? "" : "disabled"}`;

  return (
    <div className="toolbar">
      <div className="title">
        <div className="action">
          <IconFont className="svg-icon" type="icon-left-arrow" />
        </div>
        <div className="title-content">测试画面</div>
      </div>
      <div className="toolbar-center">
        <div>
          <a
            className={className}
            title="左对齐"
            onClick={() => {
              if (canGroup) {
                setAlign("left");
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-left-align" />
            </div>
          </a>
          <a
            className={className}
            title="右对齐"
            onClick={() => {
              if (canGroup) {
                setAlign("right");
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-right-align" />
            </div>
          </a>
          <a
            className={className}
            title="上对齐"
            onClick={() => {
              if (canGroup) {
                setAlign("top");
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-top-align" />
            </div>
          </a>
          <a
            className={className}
            title="下对齐"
            onClick={() => {
              if (canGroup) {
                setAlign("bottom");
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-bottom-align" />
            </div>
          </a>
          <a
            className={className}
            title="垂直对齐"
            onClick={() => {
              if (canGroup) {
                setAlign("vertical");
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-vertical-align" />
            </div>
          </a>
          <a
            className={className}
            title="水平对齐"
            onClick={() => {
              if (canGroup) {
                setAlign("horizontal");
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-horizontal-align" />
            </div>
          </a>
          <a
            className={`toolbar-item ${canGroup ? "" : "disabled"}`}
            title="水平分布"
            onClick={() => {
              if (canGroup) {
                setAlign("horizontal-between");
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-horizontal-between" />
            </div>
          </a>
          <a
            className={`toolbar-item ${canGroup ? "" : "disabled"}`}
            title="垂直分布"
            onClick={() => {
              if (canGroup) {
                setAlign("vertical-between");
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-vertical-between" />
            </div>
          </a>
        </div>
        <div>
          <a className={`toolbar-item`} title="撤销">
            <div className="icon">
              <IconFont className="svg-icon" type="icon-Undo" />
            </div>
          </a>
          <a className={`toolbar-item`} title="重做">
            <div className="icon">
              <IconFont className="svg-icon" type="icon-Redo" />
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
              <IconFont className="svg-icon" type="icon-group" />
            </div>
          </a>
          <a
            className={`toolbar-item ${isGroup ? "" : "disabled"}`}
            title="打散"
            onClick={() => {
              if (isGroup && editor) {
                editor.emit({ type: "UN_GROUP_ITEM", payload: groupId! });
              }
            }}
          >
            <div className="icon">
              <IconFont className="svg-icon" type="icon-break" />
            </div>
          </a>
        </div>
        <div>
          <div className="zoom-button-group">
            <a
              onClick={() => {
                setScale(scale.current - 5);
              }}
            >
            <IconFont className="svg-icon" type="icon-subtract" />
            </a>
            <a onDoubleClick={() => setScale(100)}>{Math.round(scale.current)}%</a>
            <a
              onClick={() => {
                setScale(scale.current + 5);
              }}
            >
            <IconFont className="svg-icon" type="icon-plus" />
            </a>
          </div>
        </div>
      </div>
      <div className="toolbar-right" />
    </div>
  );
};

export function useToolbarState(editor: Editor | null) {
  const scale = useRef<number>(100);
  const [items, setItems] = useState<Item[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [toolbarStatus, setStatus] = useState({
    isGroup: false,
    hasSelected: false,
    canGroup: false
  });

  useEffect(() => {
    let event: Subscription;
    if (editor) {
      event = editor.bus.pipe(delay(100)).subscribe(() => {
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
          setGroupId(items[0].groupId);
          setStatus({ canGroup: false, isGroup: true, hasSelected: true });
        } else {
          setStatus({ canGroup: true, isGroup: false, hasSelected: true });
        }
      } else {
        setStatus({ canGroup: false, isGroup: false, hasSelected: true });
      }
    } else {
      setStatus({ canGroup: false, isGroup: false, hasSelected: false });
    }
  }, [items]);

  const setScale = (s: number) => {
    if (editor && editor.editorView) {
      const { x, y } = editor.canvasTransform;
      editor.emit({
        type: "SET_CANVAS_TRANSFORM",
        payload: { s: s / 100, x, y }
      });
    }
  };

  const setAlign = (direction: IAlignDirection) => {
    if (editor) {
      const { canvasTransform, canvasSize } = editor;
      if (toolbarStatus.canGroup && items.length > 1) {
        const group = new Group(canvasTransform.s, items, canvasSize);
        switch (direction) {
          case "left":
            break;
          case "right":
            break;
          case "top":
            break;
          case "bottom":
            break;
          case "vertical":
            break;
          case "horizontal":
            break;
          case "vertical-between":
            break;
          case "horizontal-between":
            break;
        }
      }
    }
  };

  return { toolbarStatus, groupId, items, scale, setScale, setAlign, editor };
}

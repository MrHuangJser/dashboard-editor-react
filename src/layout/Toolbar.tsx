import _ from "lodash";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { delay } from "rxjs/operators";
import { EditorContext } from "../App";
import BottomAlign from "../assets/bottom-align.svg";
import Break from "../assets/break.svg";
import GroupIcon from "../assets/group.svg";
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
import { Group } from "../core/group";
import { Editor, Item } from "../editor";

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
          <LeftArrow className="svg-icon" width={12} height={12} />
        </div>
        <div className="title-content">测试画面</div>
      </div>
      <div className="toolbar-center">
        <div>
          <a
            className={className}
            title="左对齐"
            onClick={() => {
              if (hasSelected) {
                setAlign("left");
              }
            }}
          >
            <div className="icon">
              <LeftAlign className="svg-icon" />
            </div>
          </a>
          <a
            className={className}
            title="右对齐"
            onClick={() => {
              if (hasSelected) {
                setAlign("right");
              }
            }}
          >
            <div className="icon">
              <RightAlign className="svg-icon" />
            </div>
          </a>
          <a
            className={className}
            title="上对齐"
            onClick={() => {
              if (hasSelected) {
                setAlign("top");
              }
            }}
          >
            <div className="icon">
              <TopAlign className="svg-icon" />
            </div>
          </a>
          <a
            className={className}
            title="下对齐"
            onClick={() => {
              if (hasSelected) {
                setAlign("bottom");
              }
            }}
          >
            <div className="icon">
              <BottomAlign className="svg-icon" />
            </div>
          </a>
          <a
            className={className}
            title="垂直对齐"
            onClick={() => {
              if (hasSelected) {
                setAlign("vertical");
              }
            }}
          >
            <div className="icon">
              <VerticalAlign className="svg-icon" />
            </div>
          </a>
          <a
            className={className}
            title="水平对齐"
            onClick={() => {
              if (hasSelected) {
                setAlign("horizontal");
              }
            }}
          >
            <div className="icon">
              <HorizontalAlign className="svg-icon" />
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
              <HorizontalBetween className="svg-icon" />
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
              <GroupIcon className="svg-icon" />
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
              <Break className="svg-icon" />
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
              <Subtract className="svg-icon" />
            </a>
            <a onDoubleClick={() => setScale(100)}>{Math.round(scale.current)}%</a>
            <a
              onClick={() => {
                setScale(scale.current + 5);
              }}
            >
              <Plus className="svg-icon" />
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
      event = editor
        .on(["SELECT_ITEM", "CLEAR_ITEM_SELECT", "UN_SELECT_ITEM", "DELETE_ITEM", "SET_CANVAS_TRANSFORM"])
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
    if (editor) {
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
      if (!toolbarStatus.canGroup) {
        const group = new Group(canvasTransform.s, items, true);
        switch (direction) {
          case "left":
            editor.emit({
              type: "MOVE_ITEM",
              payload: { items, my: 0, mx: -_.minBy(group.items, i => i.transform.x)!.transform.x }
            });
            break;
          case "right":
            const rightestItem = _.maxBy(group.items, i => i.transform.x + i.size.width)!;
            editor.emit({
              type: "MOVE_ITEM",
              payload: {
                items,
                my: 0,
                mx: canvasSize.width - rightestItem.transform.x - rightestItem.size.width
              }
            });
            break;
          case "top":
            break;
          case "bottom":
            break;
          case "vertical":
            break;
          case "horizontal":
            break;
        }
      } else {
        switch (direction) {
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

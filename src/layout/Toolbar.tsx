import React, { FC, useContext, useEffect, useState } from "react";
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

export const Toolbar: FC = () => {
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
          <a className="toolbar-item" title="左对齐">
            <div className="icon">
              <LeftAlign className="svg-icon" />
            </div>
          </a>
          <a className="toolbar-item" title="右对齐">
            <div className="icon">
              <RightAlign className="svg-icon" />
            </div>
          </a>
          <a className="toolbar-item" title="上对齐">
            <div className="icon">
              <TopAlign className="svg-icon" />
            </div>
          </a>
          <a className="toolbar-item" title="下对齐">
            <div className="icon">
              <BottomAlign className="svg-icon" />
            </div>
          </a>
          <a className="toolbar-item" title="垂直对齐">
            <div className="icon">
              <VerticalAlign className="svg-icon" />
            </div>
          </a>
          <a className="toolbar-item" title="水平对齐">
            <div className="icon">
              <HorizontalAlign className="svg-icon" />
            </div>
          </a>
          <a className="toolbar-item" title="水平分布">
            <div className="icon">
              <HorizontalBetween className="svg-icon" />
            </div>
          </a>
          <a className="toolbar-item" title="垂直分布">
            <div className="icon">
              <VerticalBetween className="svg-icon" />
            </div>
          </a>
        </div>
        <div>
          <a className="toolbar-item" title="组合">
            <div className="icon">
              <Group className="svg-icon" />
            </div>
          </a>
          <a className="toolbar-item" title="打散">
            <div className="icon">
              <Break className="svg-icon" />
            </div>
          </a>
        </div>
        <div>
          <div className="zoom-button-group">
            <Subtract className="svg-icon" />
            <a>100%</a>
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
  const [] = useState();

  useEffect(() => {
    if (editor) {
      editor.on("SELECT_ITEM").subscribe();
    }
  }, [editor]);

  return {};
}

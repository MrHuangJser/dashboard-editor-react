import React from "react";
import { useResizeHandleState } from "../components";

export const ResizeHandle: React.FC = () => {
  const { show, width, height, x, y } = useResizeHandleState();

  return (
    <div className="select-handle" style={{ display: show ? "block" : "none" }}>
      <div
        className="rect"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate3d(${x}px,${y}px,0)`
        }}
      >
        <div className="rotate">
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
            <path
              // tslint:disable-next-line:max-line-length
              d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
              fill="#eb5648"
              fillRule="nonzero"
            />
          </svg>
        </div>
        <div className="t resizable-handler" style={{ cursor: "n-resize" }} />
        <div className="b resizable-handler" style={{ cursor: "s-resize" }} />
        <div className="r resizable-handler" style={{ cursor: "e-resize" }} />
        <div className="l resizable-handler" style={{ cursor: "w-resize" }} />
        <div className="tr resizable-handler" style={{ cursor: "ne-resize" }} />
        <div className="tl resizable-handler" style={{ cursor: "nw-resize" }} />
        <div className="br resizable-handler" style={{ cursor: "se-resize" }} />
        <div className="bl resizable-handler" style={{ cursor: "sw-resize" }} />
        <div className="t square" />
        <div className="b square" />
        <div className="r square" />
        <div className="l square" />
        <div className="tr square" />
        <div className="tl square" />
        <div className="br square" />
        <div className="bl square" />
      </div>
    </div>
  );
};

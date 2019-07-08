import React, { useEffect, useRef, useState } from "react";
import { useResizeHandle } from "../components";
import { Group } from "../core";
import { useDispatch, useMappedState } from "../utils";

let groupStart: Group | null = null;

export const ResizeHandle: React.FC = () => {
  const { domRef, group, groupRotateDeg } = useResizeHandleState();

  return (
    <div
      className="select-handle"
      style={{ display: group.show ? "block" : "none" }}
      ref={ref => {
        if (ref) {
          domRef.current = ref;
        }
      }}
    >
      <div
        className="rect"
        style={{
          width: `${group.size.width}px`,
          height: `${group.size.height}px`,
          transform: `translate3d(${group.transform.x}px,${
            group.transform.y
          }px,0) rotate(${groupRotateDeg}deg)`
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
        <div className="n block" style={{ cursor: "n-resize" }} />
        <div className="s block" style={{ cursor: "s-resize" }} />
        <div className="e block" style={{ cursor: "e-resize" }} />
        <div className="w block" style={{ cursor: "w-resize" }} />
        <div className="ne block" style={{ cursor: "ne-resize" }} />
        <div className="nw block" style={{ cursor: "nw-resize" }} />
        <div className="se block" style={{ cursor: "se-resize" }} />
        <div className="sw block" style={{ cursor: "sw-resize" }} />
      </div>
    </div>
  );
};

function useResizeHandleState() {
  const dispatch = useDispatch();
  const domRef = useRef<HTMLElement | undefined>();
  const { scale, items } = useMappedState(({ editorInstance, selected }) => ({
    scale: editorInstance.canvasTransform.s,
    items: [...selected]
  }));
  const [groupRotateDeg, setGroupRotateDeg] = useState(0);

  const group = new Group(items);

  const { sizeState, rotateDeg, resizeHandleStatus } = useResizeHandle({
    scale,
    items,
    domRef: domRef.current
  });

  useEffect(() => {
    if (resizeHandleStatus) {
      groupStart = new Group(items, true);
    } else {
      groupStart = null;
    }
  }, [resizeHandleStatus]);

  useEffect(() => {
    if (groupStart) {
      setGroupRotateDeg(groupStart!.transform.r + rotateDeg);
      dispatch({
        type: "TRANSLATE_ITEM",
        payload: items.map(item => ({
          id: item.id,
          ...item.transform,
          r:
            groupStart!.items.find(i => i.id === item.id)!.transform.r +
            rotateDeg
        }))
      });
    }
  }, [rotateDeg]);

  return { domRef, group, groupRotateDeg };
}

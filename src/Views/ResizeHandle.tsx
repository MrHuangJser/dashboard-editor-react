import React, { FC, useEffect, useRef, useState } from "react";
import { useResizeHandle } from "../components";
import { Group, Item } from "../core";
import { useDispatch, useMappedState } from "../utils";

export const ResizeHandle: FC = () => {
  const { domRef, group } = useResizeHandleState();
  return (
    <div
      className="select-handle"
      style={{
        display: group.show ? "block" : "none",
        width: `${group.size.width}%`,
        height: `${group.size.height}%`,
        left: `${group.transform.x}%`,
        top: `${group.transform.y}%`,
        transform: `rotate(${group.transform.r}deg)`
      }}
      ref={ref => {
        if (ref) {
          domRef.current = ref;
        }
      }}
    >
      <div className="rect">
        {group.single ? (
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
        ) : (
          ""
        )}
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

const itemMapStart: Map<Item, { r: number; x: number; y: number; width: number; height: number }> = new Map();

function useResizeHandleState() {
  const dispatch = useDispatch();
  const domRef = useRef<HTMLElement | undefined>();
  const { scale, items, editor } = useMappedState(({ editorInstance, selected }) => ({
    editor: editorInstance,
    scale: editorInstance.canvasTransform.s,
    items: selected
  }));
  const [group, setGroup] = useState<Group>(new Group(scale, [], editor.canvasSize));

  const [resizeStatus] = useResizeHandle({ domRef });

  useEffect(() => {
    if (items.size) {
      setGroup(new Group(scale, [...items], editor.canvasSize));
    } else {
      setGroup(new Group(scale, [], editor.canvasSize));
    }
  }, [items]);

  useEffect(() => {
    const { status, mx, my, direction, angle } = resizeStatus;
    switch (status) {
      case "start":
        items.forEach(item => {
          itemMapStart.set(item, { ...item.transform, ...item.size });
        });
        break;
      case "resizing":
        if (itemMapStart.size) {
          const itemsMap = sizeMap(mx / scale, my / scale, direction);
          dispatch({ type: "RESIZE_ITEM", payload: itemsMap });
          dispatch({ type: "MOVE_ITEM", payload: itemsMap });
        }
        break;
      case "rotating":
        if (itemMapStart.size) {
          items.forEach(item => {
            if (itemMapStart.get(item)) {
              dispatch({
                type: "ROTATE_ITEM",
                payload: { item, r: getRotateDeg(itemMapStart.get(item)!.r, angle) }
              });
            }
          });
        }
        break;
      case "end":
        itemMapStart.clear();
        break;
    }
  }, [resizeStatus.status, resizeStatus.angle, resizeStatus.mx, resizeStatus.my]);

  return { domRef, group };

  function sizeMap(mx: number, my: number, direction: string) {
    const itemsMap: Map<Item, { x: number; y: number; width: number; height: number }> = new Map();
    if (itemMapStart.size) {
      itemMapStart.forEach((state, item) => {
        const { x, y, width, height } = state;
        switch (direction) {
          case "n":
            itemsMap.set(item, { ...state, y: y + my, height: height - my });
            break;
          case "s":
            itemsMap.set(item, { ...state, height: height + my });
            break;
          case "e":
            itemsMap.set(item, { ...state, width: width + mx });
            break;
          case "w":
            itemsMap.set(item, { ...state, x: x + mx, width: width - mx });
            break;
          case "ne":
            itemsMap.set(item, { ...state, y: y + my, height: height - my, width: width + mx });
            break;
          case "nw":
            itemsMap.set(item, { ...state, y: y + my, x: x + mx, width: width - mx, height: height - my });
            break;
          case "se":
            itemsMap.set(item, { ...state, width: width + mx, height: height + my });
            break;
          case "sw":
            itemsMap.set(item, { ...state, x: x + mx, width: width - mx, height: height + my });
            break;
        }
      });
    }
    return itemsMap;
  }
}

function getRotateDeg(original: number, rotated: number) {
  let mergedRotateDeg = original + Math.round(rotated);
  mergedRotateDeg = mergedRotateDeg < 0 ? 360 + mergedRotateDeg : mergedRotateDeg;
  return 357 < mergedRotateDeg || mergedRotateDeg < 3 ? 0 : mergedRotateDeg;
}

import React, { MutableRefObject, useEffect, useRef } from "react";
import { useSelectArea } from "../components/SelectArea";
import { Group } from "../core";
import { useDispatch, useMappedState } from "../utils";

export const SelectAreaView: React.FC<{
  domRef: MutableRefObject<HTMLElement | undefined>;
}> = ({ domRef }) => {
  const { left, width, height, top, status, selectDomRef } = useSelectAreaState(
    domRef
  );

  return (
    <div
      className="select-area"
      ref={ref => {
        if (ref) {
          selectDomRef.current = ref;
        }
      }}
      style={{
        display: status === "moving" ? "block" : "none",
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`
      }}
    />
  );
};

function useSelectAreaState(domRef: MutableRefObject<HTMLElement | undefined>) {
  const dispatch = useDispatch();
  const selectDomRef = useRef<HTMLElement | undefined>();
  const { items, scale, selected: selectedItems } = useMappedState(
    ({ editorInstance, selected }) => ({
      items: editorInstance.items,
      scale: editorInstance.canvasTransform.s,
      selected: [...selected]
    })
  );
  const { left, top, width, height, status } = useSelectArea({ domRef });

  useEffect(() => {
    if (selectDomRef.current) {
      const selectRect = selectDomRef.current.getBoundingClientRect();
      items.forEach(item => {
        if (item.itemView) {
          const itemRect = item.itemView.getBoundingClientRect();
          if (isIn(itemRect, selectRect)) {
            if (!item.groupId) {
              dispatch({ type: "SELECT_ITEM", payload: item });
            } else {
              const group = new Group(
                scale,
                items.filter(i => i.groupId === item.groupId)
              );
              if (
                isIn(
                  {
                    left: group.minXItem!.left,
                    top: group.minYItem!.top,
                    x: 0,
                    y: 0,
                    bottom: 0,
                    right: 0,
                    ...group.size
                  },
                  selectRect
                )
              ) {
                dispatch({ type: "SELECT_ITEM", payload: group.items });
              }
            }
          } else {
            if (item.groupId) {
              dispatch({
                type: "UN_SELECT_ITEM",
                payload: items.filter(i => i.groupId === item.groupId)
              });
            } else {
              dispatch({ type: "UN_SELECT_ITEM", payload: item });
            }
          }
        }
      });
    }
  }, [left, top, width, height]);

  return { left, top, width, height, status, selectDomRef };
}

function isIn(from: ClientRect | DOMRect, to: ClientRect | DOMRect) {
  return (
    from.left > to.left &&
    from.top > to.top &&
    from.left + from.width < to.left + to.width &&
    from.top + from.height < to.top + to.height
  );
}

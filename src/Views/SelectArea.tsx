import _ from "lodash";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { useSelectArea } from "../components/SelectArea";
import { useDispatch, useMappedState } from "../utils";

export const SelectAreaView: React.FC<{
  domRef: MutableRefObject<HTMLDivElement | null>;
}> = ({ domRef }) => {
  const { left, width, height, top, status, selectDomRef } = useSelectAreaState(domRef);

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

function useSelectAreaState(domRef: MutableRefObject<HTMLElement | null>) {
  const selectDomRef = useRef<HTMLElement | undefined>();
  const dispatch = useDispatch();
  const { items, selectedItems } = useMappedState(({ editorInstance, selected }) => ({
    items: editorInstance.items,
    selectedItems: selected,
    scale: editorInstance.canvasTransform.s
  }));
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
              dispatch({ type: "SELECT_GROUP", payload: item.groupId });
            }
          } else {
            if (!item.groupId) {
              dispatch({ type: "UN_SELECT_ITEM", payload: item });
            } else {
              let flag = false;
              selectedItems.forEach(selectedItem => {
                if (selectedItem.groupId === item.groupId && selectedItem.itemView) {
                  const selectedItemRect = selectedItem.itemView.getBoundingClientRect();
                  if (isIn(selectedItemRect, selectRect)) {
                    flag = true;
                  }
                }
              });
              if (!flag) {
                selectedItems.forEach(selectedItem => {
                  if (selectedItem.groupId === item.groupId) {
                    dispatch({ type: "UN_SELECT_ITEM", payload: selectedItem });
                  }
                });
              }
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

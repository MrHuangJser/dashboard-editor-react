import React, { MutableRefObject, useEffect, useRef } from "react";
import { useSelectArea } from "../components/SelectArea";
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
  const { items } = useMappedState(({ editorInstance }) => ({
    items: editorInstance.items,
    canvasTransform: editorInstance.canvasTransform
  }));
  const { left, top, width, height, status } = useSelectArea({ domRef });

  useEffect(() => {
    if (selectDomRef.current) {
      const selectRect = selectDomRef.current.getBoundingClientRect();
      items.forEach(item => {
        if (item.itemView) {
          const itemRect = item.itemView.getBoundingClientRect();
          if (
            itemRect.left > selectRect.left &&
            itemRect.top > selectRect.top &&
            itemRect.width + itemRect.left <
              selectRect.width + selectRect.left &&
            itemRect.height + itemRect.top < selectRect.height + selectRect.top
          ) {
            dispatch({ type: "SELECT_ITEM", payload: item });
          } else {
            dispatch({ type: "UN_SELECT_ITEM", payload: item });
          }
        }
      });
    }
  }, [left, top, width, height]);

  return { left, top, width, height, status, selectDomRef };
}

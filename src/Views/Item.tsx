import React, { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useItemBorderEvent, useItemContextMenuEvent } from "../Components";
import { useDragState } from "../Components/Drag";
import { Item } from "../core";
import { ContextMenuContext, useDispatch, useMappedState } from "../utils";
import { Widgets } from "../Widgets";

export const ItemView: React.FC<{ item: Item }> = props => {
  let Widget;
  if (props.item.type !== "GROUP") {
    Widget = Widgets[props.item.type];
  }
  const { item } = props;
  const { domRef } = useItemState(props);

  return (
    <div
      data-id={`item_view_${item.id}`}
      className="item-view"
      ref={ref => {
        if (ref) {
          domRef.current = ref;
          item.itemView = ref;
        }
      }}
      style={{
        width: `${item.size.width}px`,
        height: `${item.size.height}px`,
        transform: `translate3d(${item.transform.x}px,${item.transform.y}px,0) rotate(${item.transform.r}deg)`
      }}
    >
      {Widget ? <Widget {...item.props} /> : ""}
    </div>
  );
};

let positionStart: Map<Item, { x: number; y: number }> | null = null;
function useItemState(props: { item: Item }) {
  const domRef = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const { setContextMenuProps } = useContext(ContextMenuContext);
  const { scale, items } = useMappedState(({ editorInstance, selected }) => ({
    scale: editorInstance.canvasTransform.s,
    items: selected
  }));

  const [moveStatus] = useDragState({ domRef, scale });

  useEffect(() => {
    if (moveStatus) {
      switch (moveStatus.status) {
        case "drag-start":
          positionStart = new Map();
          items.forEach(item => {
            positionStart!.set(item, { x: item.transform.x, y: item.transform.y });
          });
          if (setContextMenuProps) {
            setContextMenuProps(undefined);
          }
          if (!new Set(items).has(props.item)) {
            dispatch({ type: "CLEAR_ITEM_SELECT", payload: undefined });
            if (props.item.groupId) {
              dispatch({ type: "SELECT_GROUP", payload: props.item.groupId });
            } else {
              dispatch({ type: "SELECT_ITEM", payload: props.item });
            }
          }
          break;
        case "drag-move":
          if (positionStart) {
            const itemMap = new Map();
            items.forEach(item => {
              if (positionStart && positionStart.has(item)) {
                itemMap.set(item, {
                  x: positionStart.get(item)!.x + Math.round(moveStatus.mx),
                  y: positionStart.get(item)!.y + Math.round(moveStatus.my)
                });
              }
            });
            dispatch({ type: "MOVE_ITEM", payload: itemMap });
          }
          break;
        case "drag-end":
          positionStart = null;
          break;
      }
    }
  }, [moveStatus]);

  useItemBorderEvent({ domRef, item: props.item });
  useItemContextMenuEvent({ items: [...items], item: props.item, domRef: domRef.current });

  return { domRef };
}

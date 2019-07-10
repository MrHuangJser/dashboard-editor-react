import React, { useLayoutEffect, useRef } from "react";
import {
  useItemBorderEvent,
  useItemContextMenuEvent,
  useItemDragEvent
} from "../components";
import { Item } from "../core";
import { useMappedState } from "../utils";
import { Widgets } from "../widgets";

export const ItemView: React.FC<{ item: Item }> = props => {
  let Widget;
  if (props.item.type !== "GROUP") {
    Widget = Widgets[props.item.type];
  }
  const { item } = props;
  const { domRef } = useItemState(props);

  useLayoutEffect(() => {
    if (domRef.current) {
      item.itemView = domRef.current;
    }
  });

  return (
    <div
      data-id={`item_view_${item.id}`}
      className="item-view"
      ref={ref => {
        if (ref) {
          domRef.current = ref;
        }
      }}
      style={{
        width: `${item.size.width}px`,
        height: `${item.size.height}px`,
        transform: `translate3d(${item.transform.x}px,${
          item.transform.y
        }px,0) rotate(${item.transform.r}deg)`
      }}
    >
      {Widget ? <Widget {...item.props} /> : ""}
    </div>
  );
};

function useItemState(props: { item: Item }) {
  const domRef = useRef<HTMLElement | undefined>();

  const { scale, items, allItems } = useMappedState(
    ({ editorInstance, selected }) => ({
      scale: editorInstance.canvasTransform.s,
      allItems: editorInstance.items,
      items: [...selected]
    })
  );

  useItemDragEvent({ domRef, item: props.item, items, scale, allItems });
  useItemBorderEvent({ domRef, item: props.item, allItems });
  useItemContextMenuEvent({
    items,
    allItems,
    item: props.item,
    domRef: domRef.current
  });

  return { domRef };
}

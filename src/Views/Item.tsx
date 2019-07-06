import React, { useEffect, useRef } from "react";
import { useDragState } from "../components";
import { Item } from "../core";
import { useDispatch } from "../utils";
import { Widgets } from "../widgets";

export const ItemView: React.FC<{ item: Item }> = (props) => {
  const Widget = Widgets[props.item.type];
  const { item } = props;
  const { domRef } = useItemState(props);

  return (
    <div
      className="item-view"
      ref={(ref) => {
        if (ref) {
          domRef.current = ref;
        }
      }}
      style={{
        width: `${item.size.width}px`,
        height: `${item.size.height}px`,
        transform: `translate3d(${item.transform.x}px,${
          item.transform.y
        }px,0) rotate(${item.transform.r})`,
      }}
    >
      <Widget {...item.props} />
    </div>
  );
};

let pointerStart: [number, number] | null = null;

function useItemState(props: { item: Item }) {
  const dispatch = useDispatch();
  const domRef = useRef<HTMLElement | undefined>();

  const { dragStatus, moveState } = useDragState({ domRef });

  useEffect(() => {
    pointerStart = dragStatus
      ? [props.item.transform.x, props.item.transform.y]
      : null;
  }, [dragStatus]);

  useEffect(() => {
    if (pointerStart) {
      dispatch({
        type: "TRANSLATE_ITEM",
        payload: {
          id: props.item.id,
          x: pointerStart[0] + moveState.mx,
          y: pointerStart[1] + moveState.my,
        },
      });
    }
  }, [moveState]);

  return { domRef };
}

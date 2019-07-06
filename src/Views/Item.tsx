import React, { useEffect, useRef } from "react";
import { MutableRefObject } from "react";
import { fromEvent, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import { useDragState } from "../components";
import { Item } from "../core";
import { useDispatch, useMappedState } from "../utils";
import { Widgets } from "../widgets";

let pointerStart: [number, number] | null = null;

export const ItemView: React.FC<{ item: Item }> = props => {
  const Widget = Widgets[props.item.type];
  const { item } = props;
  const { domRef } = useItemState(props);

  return (
    <div
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
        }px,0) rotate(${item.transform.r})`
      }}
    >
      <Widget {...item.props} />
    </div>
  );
};

function useItemState(props: { item: Item }) {
  const domRef = useRef<HTMLElement | undefined>();
  const { scale } = useMappedState(({ editorInstance }) => ({
    scale: editorInstance.canvasTransform.s
  }));
  useDragEvent({ domRef, item: props.item, scale });
  useHoverEvent({ domRef, item: props.item });

  return { domRef };
}

function useDragEvent(props: {
  item: Item;
  domRef: MutableRefObject<HTMLElement | undefined>;
  scale: number;
}) {
  const dispatch = useDispatch();
  const { dragStatus, moveState } = useDragState({ domRef: props.domRef });

  useEffect(() => {
    pointerStart = dragStatus
      ? [props.item.transform.x, props.item.transform.y]
      : null;
    if (dragStatus === "on-drag") {
      dispatch({ type: "SELECT_ITEM", payload: props.item });
    }
  }, [dragStatus]);

  useEffect(() => {
    if (pointerStart) {
      dispatch({
        type: "TRANSLATE_ITEM",
        payload: {
          id: props.item.id,
          x: pointerStart[0] + moveState.mx / props.scale,
          y: pointerStart[1] + moveState.my / props.scale
        }
      });
    }
  }, [moveState]);
}

function useHoverEvent(props: {
  item: Item;
  domRef: MutableRefObject<HTMLElement | undefined>;
}) {
  const { domRef, item } = props;
  const { selected } = useMappedState(({ editorInstance }) => ({
    selected: editorInstance.selected
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    let event: Subscription;
    if (domRef.current) {
      event = fromEvent<PointerEvent>(domRef.current, "pointerover")
        .pipe(
          switchMap(() => {
            dispatch({ type: "ADD_ITEM_BORDER", payload: item });
            return fromEvent<PointerEvent>(
              domRef.current as HTMLElement,
              "pointerout"
            );
          })
        )
        .subscribe(() => {
          if (!selected.contains(item)) {
            dispatch({ type: "REMOVE_ITEM_BORDER", payload: item });
          }
        });
    }
    return () => {
      event.unsubscribe();
    };
  }, [domRef]);
}

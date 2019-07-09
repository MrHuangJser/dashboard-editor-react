import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef
} from "react";
import { fromEvent, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import { useDragState } from "../components";
import { Group, Item } from "../core";
import { useDispatch, useMappedState } from "../utils";
import { Widgets } from "../widgets";

let groupStart: Group | null = null;

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
  const { scale, items } = useMappedState(({ editorInstance, selected }) => ({
    scale: editorInstance.canvasTransform.s,
    items: [...selected]
  }));
  useDragEvent({ domRef, item: props.item, items, scale });
  useHoverEvent({ domRef, item: props.item });

  return { domRef };
}

function useDragEvent(props: {
  item: Item;
  items: Item[];
  domRef: MutableRefObject<HTMLElement | undefined>;
  scale: number;
}) {
  const dispatch = useDispatch();
  const { dragStatus, moveState } = useDragState({ domRef: props.domRef });

  useEffect(() => {
    if (!dragStatus) {
      groupStart = null;
    }
    if (dragStatus === "on-drag") {
      if (props.items.length < 2) {
        dispatch({ type: "CLEAR_ITEM_SELECT" });
        dispatch({ type: "SELECT_ITEM", payload: props.item });
        groupStart = new Group(props.scale, [props.item], true);
      } else {
        groupStart = new Group(props.scale, props.items, true);
      }
    }
  }, [dragStatus]);

  useEffect(() => {
    if (groupStart) {
      dispatch({
        type: "TRANSLATE_ITEM",
        payload: groupStart.items.map(item => ({
          id: item.id,
          x: item.transform.x + moveState.mx / props.scale,
          y: item.transform.y + moveState.my / props.scale
        }))
      });
    }
  }, [moveState]);
}

function useHoverEvent(props: {
  item: Item;
  domRef: MutableRefObject<HTMLElement | undefined>;
}) {
  const { domRef, item } = props;
  const { selectedItems } = useMappedState(({ selected }) => ({
    selectedItems: selected
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
          if (!selectedItems.has(item)) {
            dispatch({ type: "REMOVE_ITEM_BORDER", payload: item });
          }
        });
    }
    return () => {
      event.unsubscribe();
    };
  }, [domRef]);
}

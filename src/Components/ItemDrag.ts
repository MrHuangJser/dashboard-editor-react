import { MutableRefObject, useContext, useEffect } from "react";
import { Group, Item } from "../core";
import { ContextMenuContext, useDispatch } from "../utils";
import { useDragState } from "./Drag";
let groupStart: Group | null = null;

export function useItemDragEvent(props: {
  item: Item;
  items: Item[];
  allItems: Item[];
  domRef: MutableRefObject<HTMLElement | undefined>;
  scale: number;
}) {
  const dispatch = useDispatch();
  const { setContextMenuProps } = useContext(ContextMenuContext);
  const { dragStatus, moveState } = useDragState({ domRef: props.domRef });

  useEffect(() => {
    if (!dragStatus) {
      groupStart = null;
    }
    if (dragStatus === "on-drag") {
      if (setContextMenuProps) {
        setContextMenuProps(undefined);
      }
      if (props.items.findIndex(i => i.id === props.item.id) === -1) {
        dispatch({ type: "CLEAR_ITEM_SELECT" });
        if (props.item.groupId) {
          const groupItems = props.allItems.filter(
            i => i.groupId && i.groupId === props.item.groupId
          );
          dispatch({
            type: "SELECT_ITEM",
            payload: groupItems
          });
          groupStart = new Group(props.scale, groupItems, true);
        } else {
          dispatch({ type: "SELECT_ITEM", payload: props.item });
          groupStart = new Group(props.scale, [props.item], true);
        }
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

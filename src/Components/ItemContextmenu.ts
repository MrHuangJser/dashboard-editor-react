import { useContext, useEffect, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { Item } from "../core";
import { ContextMenuContext, useDispatch } from "../utils";

let position: [number, number] | null = null;

export function useItemContextMenuEvent(props: { domRef: HTMLElement | null; item: Item; items: Item[] }) {
  const { setContextMenuProps } = useContext(ContextMenuContext);
  const dispatch = useDispatch();
  const [menuWillShow, setMenuWillShow] = useState<boolean>(false);

  useEffect(() => {
    let event: Subscription;
    if (props.domRef && setContextMenuProps) {
      event = fromEvent<MouseEvent>(props.domRef, "mousedown")
        .pipe(filter(e => e.button === 2))
        .subscribe(e => {
          e.preventDefault();
          e.stopPropagation();
          position = [e.clientX, e.clientY];
          setMenuWillShow(true);
        });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [props.domRef]);

  useEffect(() => {
    if (menuWillShow) {
      if (props.items.findIndex(i => i.id === props.item.id) === -1) {
        dispatch({ type: "CLEAR_ITEM_SELECT", payload: undefined });
        if (props.item.groupId) {
          dispatch({ type: "SELECT_GROUP", payload: props.item.groupId });
        } else {
          dispatch({ type: "SELECT_ITEM", payload: props.item });
        }
      }
      showContextMenu();
      setMenuWillShow(false);
    } else {
      position = null;
    }
  }, [menuWillShow]);

  function showContextMenu() {
    if (setContextMenuProps && position) {
      setContextMenuProps({
        menus: [
          {
            key: "group",
            title: "组合",
            hidden: !!props.item.groupId || props.items.length < 2,
            bottomDivider: true
          },
          {
            key: "un_group",
            title: "打散",
            hidden: !props.item.groupId,
            bottomDivider: true
          },
          { key: "delete", title: "删除" }
        ],
        onClick: menu => itemContextMenuAction(menu.key as any),
        onClose: () => setContextMenuProps(undefined),
        visible: true,
        position: { x: position[0], y: position[1] }
      });
    }
  }

  function itemContextMenuAction(type: "group" | "delete" | "un_group") {
    switch (type) {
      case "delete":
        dispatch({ type: "DELETE_ITEM", payload: props.items });
        break;
      case "group":
        dispatch({ type: "GROUP_ITEM", payload: props.items });
        break;
      case "un_group":
        dispatch({ type: "UN_GROUP_ITEM", payload: props.item.groupId! });
        break;
    }
  }
}

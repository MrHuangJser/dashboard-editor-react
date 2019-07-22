import { MutableRefObject, useEffect } from "react";
import { fromEvent, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Item } from "../core";
import { useDispatch, useMappedState } from "../utils";

export function useItemBorderEvent(props: { item: Item; domRef: MutableRefObject<HTMLElement | null> }) {
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
            dispatch({ type: "ADD_ITEM_BORDER", payload: [item] });
            return fromEvent<PointerEvent>(domRef.current as HTMLElement, "pointerout");
          })
        )
        .subscribe(() => {
          if (!selectedItems.has(item)) {
            dispatch({ type: "REMOVE_ITEM_BORDER", payload: [item] });
          }
        });
    }
    return () => {
      event.unsubscribe();
    };
  }, [domRef, selectedItems]);
}

import React, { MutableRefObject, useEffect } from "react";
import { fromEvent, Subscription } from "rxjs";

export interface IDragProps {
  domRef: MutableRefObject<HTMLElement | undefined>;
  onDrag?: (e?: PointerEvent) => void;
}

export const Drag: React.FC<IDragProps> = (props) => {
  console.log(props);
  useDragState(props);
  return <React.Fragment>{props.children}</React.Fragment>;
};

const moveEvent = fromEvent(document, "pointermove");
const upEvent = fromEvent(document, "pointer");

export function useDragState(props: IDragProps) {
  function listenEvent() {
    if (props.domRef && props.domRef.current) {
      return fromEvent<PointerEvent>(props.domRef.current, "pointerdown")
        .pipe()
        .subscribe((e) => console.log(e));
    }
  }

  useEffect(() => {
    let refEvent: Subscription | undefined;
    refEvent = listenEvent();
    return () => {
      if (refEvent) {
        refEvent.unsubscribe();
      }
    };
  }, [props.domRef]);
}

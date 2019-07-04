import { MutableRefObject, useEffect, useRef } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter, switchMap } from "rxjs/operators";

export interface IDragWrapProps {
  domRef: MutableRefObject<HTMLElement | undefined>;
  useSpace?: boolean;
  onDrag?: (e?: PointerEvent) => void;
}

const moveEvent = fromEvent(window, "pointermove");
const upEvent = fromEvent(window, "pointerup");
const keyDownEvent = fromEvent<KeyboardEvent>(window, "keydown");
const keyUpEvent = fromEvent<KeyboardEvent>(window, "keyup");

export function useDragState(props: IDragWrapProps) {
  const spaceKey = useRef<boolean>(false);

  useEffect(listenKeyEvent, []);

  useEffect(() => {
    let refEvent: Subscription | undefined;
    refEvent = listenEvent();
    return () => {
      if (refEvent) {
        refEvent.unsubscribe();
      }
    };
  }, [props.domRef]);

  function listenKeyEvent() {
    const keyEvent = keyDownEvent
      .pipe(
        switchMap((e) => {
          if (e.code === "Space") {
            spaceKey.current = true;
            if (props.useSpace && props.domRef.current) {
              props.domRef.current.classList.add("in-drag");
            }
          }
          return keyUpEvent;
        }),
        filter((e) => e.code === "Space"),
      )
      .subscribe(() => {
        spaceKey.current = false;
        if (props.domRef.current) {
          props.domRef.current.classList.remove("in-drag");
        }
      });
    return () => {
      if (keyEvent) {
        keyEvent.unsubscribe();
      }
    };
  }

  function listenEvent() {
    if (props.domRef && props.domRef.current) {
      return fromEvent<PointerEvent>(props.domRef.current, "pointerdown")
        .pipe()
        .subscribe((e) => console.log(e));
    }
  }
}

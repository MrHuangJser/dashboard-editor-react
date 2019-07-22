import { MutableRefObject, useEffect, useRef, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";

export interface IDragWrapProps {
  domRef: MutableRefObject<HTMLElement | null>;
  scale?: number;
  useSpace?: boolean;
}

interface IMoveStatus {
  status: "drag-start" | "drag-move" | "drag-end";
  event: PointerEvent;
  mx: number;
  my: number;
}

const moveEvent = fromEvent<PointerEvent>(window, "pointermove");
const upEvent = fromEvent<PointerEvent>(window, "pointerup").pipe(filter(e => e.button === 0));
const keyDownEvent = fromEvent<KeyboardEvent>(window, "keydown");
const keyUpEvent = fromEvent<KeyboardEvent>(window, "keyup");
let pointerStart: [number, number] | null = null;

export function useDragState({ domRef, useSpace, scale = 1 }: IDragWrapProps): [IMoveStatus | null] {
  const spaceKey = useRef<boolean>(false);
  const [status, setStatus] = useState<IMoveStatus | null>(null);

  useEffect(listenKeyEvent, [domRef]);

  useEffect(listenEvent, [domRef, scale]);

  return [status];

  function listenKeyEvent() {
    let keyEvent: Subscription;
    if (domRef.current) {
      keyEvent = keyDownEvent
        .pipe(
          switchMap(e => {
            if (e.code === "Space") {
              spaceKey.current = true;
              if (useSpace && domRef.current) {
                domRef.current.classList.add("in-drag");
              }
            }
            return keyUpEvent;
          }),
          filter(e => e.code === "Space")
        )
        .subscribe(() => {
          spaceKey.current = false;
          if (domRef.current) {
            domRef.current.classList.remove("in-drag");
          }
        });
    }
    return () => {
      if (keyEvent) {
        keyEvent.unsubscribe();
      }
    };
  }

  function listenEvent() {
    let refEvent: Subscription | undefined;
    if (domRef.current) {
      refEvent = fromEvent<PointerEvent>(domRef.current, "pointerdown")
        .pipe(
          filter(e => e.button === 0),
          filter(() => (useSpace ? spaceKey.current : !spaceKey.current)),
          switchMap(startEvent => {
            startEvent.preventDefault();
            startEvent.stopPropagation();
            domRef.current!.classList.add("on-drag");
            setStatus({ status: "drag-start", event: startEvent, mx: 0, my: 0 });
            pointerStart = [startEvent.clientX, startEvent.clientY];
            return moveEvent.pipe(
              takeUntil(
                upEvent.pipe(
                  map(endEvent => {
                    domRef.current!.classList.remove("on-drag");
                    setStatus({ status: "drag-end", event: endEvent, mx: 0, my: 0 });
                    pointerStart = null;
                  })
                )
              )
            );
          }),
          filter(() => (useSpace ? spaceKey.current : !spaceKey.current))
        )
        .subscribe(moveEv => {
          if (pointerStart) {
            setStatus({
              status: "drag-move",
              event: moveEv,
              mx: (moveEv.clientX - pointerStart[0]) / scale,
              my: (moveEv.clientY - pointerStart[1]) / scale
            });
          }
        });
    }
    return () => {
      if (refEvent) {
        refEvent.unsubscribe();
      }
    };
  }
}

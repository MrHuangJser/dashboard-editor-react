import { MutableRefObject, useEffect, useRef, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";

export interface IDragWrapProps {
  domRef: MutableRefObject<HTMLElement | undefined>;
  useSpace?: boolean;
}

const moveEvent = fromEvent<PointerEvent>(window, "pointermove");
const upEvent = fromEvent<PointerEvent>(window, "pointerup");
const keyDownEvent = fromEvent<KeyboardEvent>(window, "keydown");
const keyUpEvent = fromEvent<KeyboardEvent>(window, "keyup");

let pointerStart: [number, number] | null = null;

export const useDragState = (props: IDragWrapProps) => {
  const spaceKey = useRef<boolean>(false);
  const [dragStatus, setDragStatus] = useState<"on-drag" | "in-drag" | null>(
    null
  );
  const [moveState, setMoveState] = useState<{ mx: number; my: number }>({
    mx: 0,
    my: 0
  });

  useEffect(listenKeyEvent, [props.domRef]);

  useEffect(listenEvent, [props.domRef]);

  return { dragStatus, moveState };

  function listenKeyEvent() {
    const keyEvent = keyDownEvent
      .pipe(
        switchMap(e => {
          if (e.code === "Space") {
            spaceKey.current = true;
            setDragStatus("on-drag");
            if (props.useSpace && props.domRef.current) {
              props.domRef.current.classList.add("in-drag");
            }
          }
          return keyUpEvent;
        }),
        filter(e => e.code === "Space")
      )
      .subscribe(() => {
        spaceKey.current = false;
        setDragStatus(null);
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
    let refEvent: Subscription | undefined;
    if (props.domRef && props.domRef.current) {
      refEvent = fromEvent<PointerEvent>(props.domRef.current, "pointerdown")
        .pipe(
          filter(() => (props.useSpace ? spaceKey.current : !spaceKey.current)),
          switchMap(e => {
            down(e);
            return moveEvent.pipe(takeUntil(upEvent.pipe(map(ev => up()))));
          }),
          filter(() => (props.useSpace ? spaceKey.current : !spaceKey.current))
        )
        .subscribe(e => move(e));
    }
    return () => {
      if (refEvent) {
        refEvent.unsubscribe();
      }
    };
  }

  function down(e: PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    pointerStart = [e.pageX, e.pageY];
    if (props.domRef && props.domRef.current) {
      props.domRef.current.classList.add("on-drag");
    }
    setDragStatus("on-drag");
  }

  function move(e: PointerEvent) {
    if (pointerStart) {
      e.stopPropagation();
      e.preventDefault();
      const [x, y] = [e.pageX, e.pageY];
      const delta = [x - pointerStart[0], y - pointerStart[1]];
      setMoveState({ mx: delta[0], my: delta[1] });
    }
  }

  function up() {
    if (pointerStart) {
      pointerStart = null;
      if (props.domRef && props.domRef.current) {
        props.domRef.current.classList.remove("on-drag");
      }
      setDragStatus(null);
    }
  }
};

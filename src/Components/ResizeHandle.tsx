import { useEffect, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Item } from "../core";
import { useDispatch } from "../utils";

let center: [number, number] | null = null;
let start: [number, number] | null = null;
let oldRotateDeg = 0;
let direction: string = "";
const moveEvent = fromEvent<PointerEvent>(window, "pointermove");
const upEvent = fromEvent<PointerEvent>(window, "pointerup");

export function useResizeHandle(props: {
  domRef: HTMLElement | undefined;
  items: Item[];
  scale: number;
}) {
  const dispatch = useDispatch();
  const { domRef, scale, items } = props;
  const [rotateDeg, setDeg] = useState(0);
  const [sizeState, setResizeState] = useState({ x: 0, y: 0, direction: "" });
  const [resizeHandleStatus, setStatus] = useState(false);

  useEffect(listenEvent, [props.domRef]);

  return {
    rotateDeg,
    sizeState,
    resizeHandleStatus
  };

  function listenEvent() {
    let event: Subscription;
    if (domRef) {
      event = fromEvent<PointerEvent>(domRef, "pointerdown")
        .pipe(
          map(e => down(e)),
          switchMap(type => {
            return moveEvent.pipe(
              map(e => ({ e, type })),
              takeUntil(upEvent.pipe(map(ev => up(ev))))
            );
          })
        )
        .subscribe(({ e, type }) => move(e, type));
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }

  function down(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    setStatus(true);
    start = [e.clientX, e.clientY];
    direction = (e.target as HTMLElement).classList[0];
    const eleRect = (domRef!.querySelector(
      ".rect"
    ) as HTMLElement).getBoundingClientRect();
    center = [
      eleRect.left + eleRect.width / 2,
      eleRect.top + eleRect.height / 2
    ];
    return (e.target as HTMLElement).classList.contains("rotate")
      ? "rotate"
      : "resize";
  }

  function move(e: PointerEvent, type: "rotate" | "resize" | undefined) {
    if (start && center) {
      const mx = e.clientX - start[0];
      const my = e.clientY - start[1];
      switch (type) {
        case "resize":
          setResizeState({
            x: mx,
            y: my,
            direction
          });
          break;
        case "rotate":
          const r = getRotate([e.clientX, e.clientY]);
          const d =
            (start[0] - center[0]) * (e.clientY - center[1]) -
            (start[1] - center[1]) * (e.clientX - center[0]);
          if (d > 0) {
            setDeg(r < oldRotateDeg ? r - 360 : r);
          } else {
            setDeg(r < oldRotateDeg ? 360 - r : -r);
          }
          oldRotateDeg = r;
          break;
      }
    }
  }

  function up(e: PointerEvent) {
    start = null;
    setStatus(false);
  }
}

function getRotate(end: [number, number]) {
  const a2 = Math.pow(end[0] - start![0], 2) + Math.pow(end[1] - start![1], 2);
  const b2 =
    Math.pow(end[0] - center![0], 2) + Math.pow(end[1] - center![1], 2);
  const c2 =
    Math.pow(start![0] - center![0], 2) + Math.pow(start![1] - center![1], 2);
  return (
    (Math.acos((b2 + c2 - a2) / (2 * Math.sqrt(b2) * Math.sqrt(c2))) * 180) /
    Math.PI
  );
}

function getRotateDirection(
  centerPoint: [number, number],
  startPoint: [number, number],
  endPoint: [number, number]
) {
  console.log(
    "start quadrant",
    startPoint[0] - centerPoint[0],
    startPoint[1] - centerPoint[1]
  );
  console.log(
    "end quadrant",
    endPoint[0] - centerPoint[0],
    endPoint[1] - centerPoint[1]
  );
  return true;
}

import { MutableRefObject, useEffect, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";

interface IResizeSelectorStatus {
  status: "start" | "resizing" | "rotating" | "end" | null;
  direction: string;
  mx: number;
  my: number;
  angle: number;
}

let center: [number, number] | null = null;
let start: [number, number] | null = null;
let oldRotateDeg = 0;
let direction: string = "";
const moveEvent = fromEvent<PointerEvent>(window, "pointermove");
const upEvent = fromEvent<PointerEvent>(window, "pointerup").pipe(filter(e => e.button === 0));

export function useResizeHandle(props: {
  domRef: MutableRefObject<HTMLElement | undefined>;
}): [IResizeSelectorStatus] {
  const { domRef } = props;
  const [rotateDeg, setDeg] = useState(0);
  const [sizeState, setResizeState] = useState({ x: 0, y: 0, direction: "" });
  const [status, setStatus] = useState<IResizeSelectorStatus["status"]>(null);

  useEffect(listenEvent, [props.domRef]);

  return [{ status, mx: sizeState.x, my: sizeState.y, angle: rotateDeg, direction: sizeState.direction }];

  function listenEvent() {
    let event: Subscription;
    if (domRef && domRef.current) {
      event = fromEvent<PointerEvent>(domRef.current, "pointerdown")
        .pipe(
          filter(e => e.button === 0),
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
    setStatus("start");
    start = [e.clientX, e.clientY];
    direction = (e.target as HTMLElement).classList[0];
    const eleRect = (domRef!.current!.querySelector(".rect") as HTMLElement).getBoundingClientRect();
    center = [eleRect.left + eleRect.width / 2, eleRect.top + eleRect.height / 2];
    return (e.target as HTMLElement).classList.contains("rotate") ? "rotate" : "resize";
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
          setStatus("resizing");
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
          setStatus("rotating");
          break;
      }
    }
  }

  function up(e: PointerEvent) {
    start = null;
    setStatus("end");
  }
}

function getRotate(end: [number, number]) {
  const a2 = Math.pow(end[0] - start![0], 2) + Math.pow(end[1] - start![1], 2);
  const b2 = Math.pow(end[0] - center![0], 2) + Math.pow(end[1] - center![1], 2);
  const c2 = Math.pow(start![0] - center![0], 2) + Math.pow(start![1] - center![1], 2);
  return (Math.acos((b2 + c2 - a2) / (2 * Math.sqrt(b2) * Math.sqrt(c2))) * 180) / Math.PI;
}

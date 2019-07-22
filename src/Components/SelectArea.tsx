import {
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useState
} from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";

export interface ISelectAreaProps
  extends PropsWithChildren<{
    domRef: MutableRefObject<HTMLElement | null>;
  }> {}

type SelectStatusType = "start" | "moving" | "end" | null;

const moveEvent = fromEvent<PointerEvent>(window, "pointermove");
const upEvent = fromEvent<PointerEvent>(window, "pointerup").pipe(
  filter(e => e.button === 0)
);
let pointerStart: [number, number] | null = null;

export const useSelectArea = (props: ISelectAreaProps) => {
  const [status, setStatus] = useState<SelectStatusType>(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(listenEvent, [props.domRef]);

  return { status, left, top, height, width, setStatus };

  function listenEvent() {
    let subscription: Subscription;
    if (props.domRef && props.domRef.current) {
      subscription = fromEvent<PointerEvent>(
        props.domRef.current,
        "pointerdown"
      )
        .pipe(
          filter(e => e.button === 0),
          filter(
            () =>
              !!(
                props.domRef &&
                props.domRef.current &&
                !props.domRef.current.classList.contains("in-drag")
              )
          ),
          switchMap(e => {
            down(e);
            return moveEvent.pipe(takeUntil(upEvent.pipe(map(ev => up(ev)))));
          })
        )
        .subscribe(e => move(e));
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }

  function down(e: PointerEvent) {
    setStatus("start");
    pointerStart = [e.clientX, e.clientY];
  }
  function move(e: PointerEvent) {
    if (pointerStart && props.domRef && props.domRef.current) {
      e.preventDefault();
      setStatus("moving");
      const mx = e.clientX - pointerStart[0];
      const my = e.clientY - pointerStart[1];
      setWidth(Math.abs(mx));
      setHeight(Math.abs(my));
      const rect = props.domRef.current.getBoundingClientRect();
      const center = [pointerStart[0] - rect.left, pointerStart[1] - rect.top];
      setLeft(mx > 0 ? center[0] : center[0] + mx);
      setTop(my > 0 ? center[1] : center[1] + my);
    }
  }
  function up(e: PointerEvent) {
    setStatus("end");
    pointerStart = null;
  }
};

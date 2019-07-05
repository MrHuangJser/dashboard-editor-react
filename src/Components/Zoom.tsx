import { MutableRefObject, useEffect, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ITransform } from "../types/index";

export interface IZoomWrapProps {
  transform: ITransform;
  intensity?: number;
  domRef: MutableRefObject<HTMLElement | undefined>;
}

export const useZoomState = (props: IZoomWrapProps) => {
  const [trans, setTransform] = useState({
    s: props.transform.s,
    ox: 0,
    oy: 0,
  });

  useEffect(() => {
    const refEvent = listenEvent();

    return () => {
      if (refEvent) {
        refEvent.unsubscribe();
      }
    };
  }, [props]);

  return trans;

  function wheel(ev: WheelEvent) {
    const { intensity = 0.1, domRef, transform } = props;
    ev.preventDefault();
    if (domRef && domRef.current) {
      const rect = domRef.current.getBoundingClientRect();
      const cx = ev.clientX - rect.left;
      const cy = ev.clientY - rect.top;
      const wheelDelta = (ev as any).wheelDelta as number;
      const delta =
        (wheelDelta ? wheelDelta / 120 : -ev.deltaY / 3) * intensity;
      setTransform({
        s: transform.s * (1 + delta),
        ox: (transform.x - cx) * delta,
        oy: (transform.y - cy) * delta,
      });
    }
  }

  function listenEvent(): Subscription | undefined {
    if (props.domRef && props.domRef.current) {
      return fromEvent<WheelEvent>(props.domRef.current, "wheel")
        .pipe(filter((e) => e.ctrlKey || e.metaKey))
        .subscribe((e) => wheel(e));
    }
  }
};

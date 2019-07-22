import { MutableRefObject, useEffect, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ITransform } from "../types";

export interface IZoomWrapProps {
  transform: ITransform;
  intensity?: number;
  domRef: MutableRefObject<HTMLDivElement | null>;
}

export const useZoomState = (props: IZoomWrapProps) => {
  const [trans, setTransform] = useState({
    s: props.transform.s,
    ox: 0,
    oy: 0
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
    const { intensity = 0.05, domRef, transform } = props;
    ev.preventDefault();
    const canvasDom: HTMLElement | null = document.querySelector(".canvas");
    if (canvasDom) {
      const rect = canvasDom.getBoundingClientRect();
      const wheelDelta = (ev as any).wheelDelta as number;
      const delta = (wheelDelta ? wheelDelta / 120 : -ev.deltaY / 3) * intensity;
      setTransform({
        s: transform.s + delta,
        ox: -(ev.clientX - rect.left) * delta,
        oy: -(ev.clientY - rect.top) * delta
      });
    }
  }

  function listenEvent(): Subscription | undefined {
    if (props.domRef && props.domRef.current) {
      return fromEvent<WheelEvent>(props.domRef.current, "wheel")
        .pipe(filter(e => e.ctrlKey || e.metaKey))
        .subscribe(e => wheel(e));
    }
  }
};

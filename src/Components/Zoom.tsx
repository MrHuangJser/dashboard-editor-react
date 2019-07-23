import { MutableRefObject, useEffect, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ISize, ITransform } from "../types";

export interface IZoomWrapProps {
  domRef: MutableRefObject<HTMLElement | null>;
  transform: ITransform;
  size: ISize;
  intensity?: number;
}

export const useZoomState = (props: IZoomWrapProps) => {
  const [trans, setTransform] = useState({ s: props.transform.s, ox: 0, oy: 0 });

  useEffect(() => {
    const refEvent = listenEvent();

    return () => {
      if (refEvent) {
        refEvent.unsubscribe();
      }
    };
  }, [props.domRef.current, props.size.width, props.size.height]);

  return trans;

  function wheel(ev: WheelEvent) {
    const { intensity = 0.01, domRef, size } = props;
    ev.preventDefault();
    if (domRef && domRef.current) {
      const canvasDom: HTMLElement | null = domRef.current.querySelector(".canvas") as HTMLElement;
      if (canvasDom) {
        const rect = canvasDom.getBoundingClientRect();
        const wheelDelta = (ev as any).wheelDelta / 120 || -ev.deltaY / 3;
        const delta = (wheelDelta / Math.abs(wheelDelta)) * intensity;
        const oxDelta = (delta * size.width) / rect.width;
        const oyDelta = (delta * size.height) / rect.height;
        setTransform({
          s: delta,
          ox: -(ev.clientX - rect.left) * oxDelta,
          oy: -(ev.clientY - rect.top) * oyDelta
        });
      }
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

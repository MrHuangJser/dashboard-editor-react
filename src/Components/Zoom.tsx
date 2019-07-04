import { MutableRefObject, useEffect, useRef } from "react";
import { fromEvent, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ITransform } from "../types/index";

export interface IZoomWrapProps {
  transform: ITransform;
  intensity?: number;
  domRef: MutableRefObject<HTMLElement | undefined>;
  onZoom?: (transform: ITransform) => void;
}

export function useZoomState(props: IZoomWrapProps) {
  const transform = useRef<ITransform>(props.transform);

  useEffect(() => {
    const refEvent = listenEvent();

    return () => {
      if (refEvent) {
        refEvent.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    transform.current = props.transform;
  }, [props]);

  function wheel(ev: WheelEvent) {
    const { intensity = 0.1, onZoom, domRef } = props;
    ev.preventDefault();
    if (domRef && domRef.current && onZoom) {
      const rect = domRef.current.getBoundingClientRect();
      const cx = ev.clientX - rect.left;
      const cy = ev.clientY - rect.top;
      const wheelDelta = (ev as any).wheelDelta as number;
      const delta =
        (wheelDelta ? wheelDelta / 120 : -ev.deltaY / 3) * intensity;
      const ox = (transform.current.x - cx) * delta;
      const oy = (transform.current.y - cy) * delta;
      onZoom({
        s: transform.current.s * (1 + delta),
        x: transform.current.x + ox,
        y: transform.current.y + oy,
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
}

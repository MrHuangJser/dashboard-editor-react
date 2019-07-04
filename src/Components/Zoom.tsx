import { Component } from "react";
import ReactDOM from "react-dom";
import { fromEvent, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ITransform } from "../types/index";

export class ZoomWrap extends Component<{
  transform: ITransform;
  onZoom?: (transform: ITransform) => void;
  intensity?: number;
}> {
  private domRef: HTMLElement | undefined;
  private subscriptions: Subscription[] = [];

  public componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    if (dom instanceof HTMLElement) {
      this.domRef = dom;
      this.subscriptions.push(
        fromEvent<WheelEvent>(this.domRef, "wheel")
          .pipe(filter((e) => e.metaKey || e.ctrlKey))
          .subscribe((e) => this.wheel(e)),
      );
    }
  }

  public render() {
    return this.props.children;
  }

  public componentWillUnmount() {
    this.subscriptions.forEach((i) => i.unsubscribe());
  }

  private wheel(ev: WheelEvent) {
    const { intensity = 0.1, onZoom, transform } = this.props;
    ev.preventDefault();
    if (this.domRef && onZoom) {
      const rect = this.domRef.getBoundingClientRect();
      const cx = ev.clientX - rect.left;
      const cy = ev.clientY - rect.top;
      const wheelDelta = (ev as any).wheelDelta as number;
      const delta =
        (wheelDelta ? wheelDelta / 120 : -ev.deltaY / 3) * intensity;
      const ox = (transform.x - cx) * delta;
      const oy = (transform.y - cy) * delta;
      onZoom({
        s: transform.s * (1 + delta),
        x: transform.x + ox,
        y: transform.y + oy,
      });
    }
  }
}

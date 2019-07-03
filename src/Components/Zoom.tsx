import { Component } from "react";
import ReactDOM from "react-dom";
import { fromEvent, Subscription } from "rxjs";
import { filter } from "rxjs/operators";

export class ZoomWrap extends Component<{
  onZoom?: (delta: number, ox: number, oy: number) => void;
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

  public componentWillReceiveProps(nextProps: any) {
    console.log(nextProps);
  }

  private wheel(ev: WheelEvent) {
    const { intensity = 0.1, onZoom } = this.props;
    ev.preventDefault();
    if (this.domRef && onZoom) {
      const wheelDelta = (ev as any).wheelDelta as number;
      const delta = (wheelDelta ? wheelDelta / 120 : -ev.deltaY / 3) * intensity;
      onZoom(delta, ev.clientX, ev.clientY);
    }
  }
}

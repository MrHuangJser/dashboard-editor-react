import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { IAction } from "./reducer";

export type IEventTypes = { [key in IAction["type"]]: IAction["payload"] };

export class EventBus {
  public bus: Subject<IAction>;

  constructor(event?: EventBus) {
    this.bus = event instanceof EventBus ? event.bus : new Subject();
  }

  public emit(params: IAction) {
    this.bus.next(params);
  }

  public on<K extends keyof IEventTypes>(type: K): Observable<IEventTypes[K]> {
    return this.bus.pipe(
      filter(res => res.type === type),
      map(res => res.payload)
    );
  }
}

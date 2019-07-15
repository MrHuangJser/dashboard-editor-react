import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { IEventTypes } from "../types";

type K = keyof IEventTypes;

export class EventBus {
  public bus: Subject<{ type: K; payload: IEventTypes[K] }>;

  constructor(event?: EventBus) {
    this.bus = event instanceof EventBus ? event.bus : new Subject();
  }

  public emit(params: { type: K; payload: IEventTypes[K] }) {
    this.bus.next(params);
  }

  public on(type: K): Observable<IEventTypes[K]> {
    return this.bus.pipe(
      filter(res => res.type === type),
      map(res => res.payload)
    );
  }
}

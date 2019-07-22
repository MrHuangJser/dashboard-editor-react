import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { IEventTypes } from "../types";

export class EventBus {
  public bus: Subject<any>;

  constructor(event?: EventBus) {
    this.bus = event instanceof EventBus ? event.bus : new Subject();
  }

  public emit<K extends keyof IEventTypes>(params: { type: K; payload: IEventTypes[K] }) {
    this.bus.next(params);
  }

  public on<K extends keyof IEventTypes>(type: K | K[]): Observable<IEventTypes[K]> {
    return this.bus.pipe(
      filter(res => {
        if (Array.isArray(type)) {
          return type.indexOf(res.type) !== -1;
        }
        return res.type === type;
      }),
      map(res => res.payload)
    );
  }
}

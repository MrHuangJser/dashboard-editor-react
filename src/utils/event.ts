import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Editor, Item } from "../core";

export interface IEventTypes {
  initEditor: Editor;
  addItem: Item;
}

export class EventBus {
  public bus: Subject<{ type: string; payload: any }>;

  constructor(event?: EventBus) {
    this.bus = event instanceof EventBus ? event.bus : new Subject();
  }

  public emit<K extends keyof IEventTypes>(type: K, params: IEventTypes[K]) {
    this.bus.next({ type, payload: params });
  }

  public on<K extends keyof IEventTypes>(type: K): Observable<IEventTypes[K]> {
    return this.bus.pipe(
      filter((res) => res.type === type),
      map((res) => res.payload),
    );
  }
}

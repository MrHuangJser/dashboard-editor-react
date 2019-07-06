import { Item } from "./item";

export class Selected {
  public list: Item[] = [];

  public add(item: Item, accumulate = false) {
    if (!accumulate) {
      this.list = [item];
    } else if (!this.contains(item)) {
      this.list.push(item);
    }
  }

  public clear() {
    this.list = [];
  }

  public remove(item: Item) {
    this.list.splice(this.list.indexOf(item), 1);
  }

  public contains(item: Item) {
    return this.list.indexOf(item) !== -1;
  }

  public each(callback: (n: Item, index: number) => any) {
    this.list.forEach(callback);
  }
}

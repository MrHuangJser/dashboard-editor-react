import _ from "lodash";
import { Item } from "./item";

export class Group extends Item {
  public items: Item[];
  public show = false;
  public single = false;

  constructor(scale = 1, items: Item[], deep = false) {
    super("GROUP");
    this.show = !!items.length;
    this.single = items.length === 1;
    this.items = deep ? items.map(item => _.cloneDeep(item)) : items;

    const minXItem = _.minBy(items, item => item.transform.x);
    const minYItem = _.minBy(items, item => item.transform.y);
    const maxXItem = _.maxBy(items, item => item.transform.x + item.size.width);
    const maxYItem = _.maxBy(
      items,
      item => item.transform.y + item.size.height
    );

    if (this.show) {
      this.size = {
        width:
          (maxXItem!.transform.x +
            maxXItem!.size.width -
            minXItem!.transform.x) *
          scale,
        height:
          (maxYItem!.transform.y +
            maxYItem!.size.height -
            minYItem!.transform.y) *
          scale
      };
      this.transform = {
        r: items.length > 1 ? 0 : items[0].transform.r,
        x: minXItem!.transform.x * scale,
        y: minYItem!.transform.y * scale
      };
    }
  }
}

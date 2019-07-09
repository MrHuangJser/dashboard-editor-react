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

    if (this.show) {
      if (this.single) {
        this.size = {
          width: this.items[0].size.width * scale,
          height: this.items[0].size.height * scale
        };
        this.transform = {
          r: this.items[0].transform.r,
          x: this.items[0].transform.x * scale,
          y: this.items[0].transform.y * scale
        };
      } else {
        const minXItem = _.minBy(
          items,
          item => item.itemView!.getBoundingClientRect().left
        )!.itemView!.getBoundingClientRect();
        const minYItem = _.minBy(
          items,
          item => item.itemView!.getBoundingClientRect().top
        )!.itemView!.getBoundingClientRect();
        const maxXItem = _.maxBy(items, item => {
          const rect = item.itemView!.getBoundingClientRect();
          return rect.left + rect.width;
        })!.itemView!.getBoundingClientRect();
        const maxYItem = _.maxBy(items, item => {
          const rect = item.itemView!.getBoundingClientRect();
          return rect.top + rect.height;
        })!.itemView!.getBoundingClientRect();
        this.size = {
          width: maxXItem.left + maxXItem.width - minXItem.left,
          height: maxYItem.top + maxYItem.height - minYItem.top
        };
        const areaRect = document
          .querySelector(".no-zoom-area")!
          .getBoundingClientRect();
        this.transform = {
          r: 0,
          x: minXItem.left - areaRect.left,
          y: minYItem.top - areaRect.top
        };
      }
    }
  }
}

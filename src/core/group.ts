import _ from "lodash";
import { Item } from "./item";

export class Group extends Item {
  public items: Item[];
  public show = false;
  public single = false;
  public minXItem: ClientRect | DOMRect | undefined;
  public minYItem: ClientRect | DOMRect | undefined;
  public maxXItem: ClientRect | DOMRect | undefined;
  public maxYItem: ClientRect | DOMRect | undefined;

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
        this.minXItem = _.minBy(
          items,
          item => item.itemView!.getBoundingClientRect().left
        )!.itemView!.getBoundingClientRect();
        this.minYItem = _.minBy(
          items,
          item => item.itemView!.getBoundingClientRect().top
        )!.itemView!.getBoundingClientRect();
        this.maxXItem = _.maxBy(items, item => {
          const rect = item.itemView!.getBoundingClientRect();
          return rect.left + rect.width;
        })!.itemView!.getBoundingClientRect();
        this.maxYItem = _.maxBy(items, item => {
          const rect = item.itemView!.getBoundingClientRect();
          return rect.top + rect.height;
        })!.itemView!.getBoundingClientRect();
        this.size = {
          width: this.maxXItem.left + this.maxXItem.width - this.minXItem.left,
          height: this.maxYItem.top + this.maxYItem.height - this.minYItem.top
        };
        const areaRect = document
          .querySelector(".no-zoom-area")!
          .getBoundingClientRect();
        this.transform = {
          r: 0,
          x: this.minXItem.left - areaRect.left,
          y: this.minYItem.top - areaRect.top
        };
      }
    }
  }
}

import _ from "lodash";
import { ISize } from "../types";
import { Item } from "./item";

export class Group extends Item {
  public items: Item[];
  public show = false;
  public single = false;
  public minXItem: Item | undefined;
  public minYItem: Item | undefined;
  public maxXItem: Item | undefined;
  public maxYItem: Item | undefined;

  constructor(scale = 1, items: Item[], canvasSize: ISize) {
    super("GROUP");
    this.show = !!items.length;
    this.single = items.length === 1;
    this.items = [...items];

    if (this.show) {
      if (this.single) {
        this.size = {
          width: (this.items[0].size.width / canvasSize.width) * 100,
          height: (this.items[0].size.height / canvasSize.height) * 100
        };
        this.transform = {
          r: this.items[0].transform.r,
          x: (this.items[0].transform.x / canvasSize.width) * 100,
          y: (this.items[0].transform.y / canvasSize.height) * 100
        };
      } else {
        this.minXItem = _.minBy(items, item => item.transform.x);
        this.minYItem = _.minBy(items, item => item.transform.y);
        this.maxXItem = _.maxBy(items, item => item.transform.x + item.size.width);
        this.maxYItem = _.maxBy(items, item => item.transform.y + item.size.height);
        this.size = {
          width:
            ((this.maxXItem!.transform.x + this.maxXItem!.size.width - this.minXItem!.transform.x) /
              canvasSize.width) *
            100,
          height:
            ((this.maxYItem!.transform.y + this.maxYItem!.size.height - this.minYItem!.transform.y) /
              canvasSize.height) *
            100
        };
        this.transform = {
          r: 0,
          x: (this.minXItem!.transform.x / canvasSize.width) * 100,
          y: (this.minYItem!.transform.y / canvasSize.height) * 100
        };
      }
    }
  }
}

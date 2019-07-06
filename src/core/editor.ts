import { ISize, ITransform } from "../types/Editor";
import { EventBus } from "../utils/event";
import { Item } from "./item";

export class Editor extends EventBus {
  public id: string;
  public items: Item[] = [];
  public canvasTransform: ITransform = { s: 1, x: 0, y: 0 };
  public canvasSize: ISize = { width: 800, height: 400 };

  constructor(config?: {
    size?: ISize;
    transform?: ITransform;
    items?: Item[];
  }) {
    super(new EventBus());
    this.id = `${Date.now()}_${Math.round(Math.random() * 10000)}`;
    if (config) {
      if (config.size) {
        this.canvasSize = { ...this.canvasSize, ...config.size };
      }
      if (config.transform) {
        this.canvasTransform = { ...this.canvasTransform, ...config.transform };
      }
      if (config.items) {
        this.items = config.items;
      }
    }
  }

  public addItem(item: Item) {
    this.emit("addItem", item);
  }
}

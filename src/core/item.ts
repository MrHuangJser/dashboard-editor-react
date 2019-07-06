import { ISize } from "../types";
import { IWidgetTypes } from "../widgets";

type k = keyof IWidgetTypes;

export class Item {
  public id: string;
  public type: k;
  public props: IWidgetTypes[k] | undefined;
  public transform = { r: 0, x: 0, y: 0 };
  public size: ISize = { width: 100, height: 50 };

  constructor(type: k, props?: IWidgetTypes[k]) {
    this.type = type;
    this.props = props;
    this.id = `item_${Date.now()}_${Math.round(Math.random() * 1000)}`;
  }
}
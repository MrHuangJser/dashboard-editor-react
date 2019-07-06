import React from "react";
import { Item } from "../core";
import { Widgets } from "../widgets";

export const ItemView: React.FC<{ item: Item }> = (props) => {
  const Widget = Widgets[props.item.type];
  const { item } = props;

  return (
    <div
      className="item-view"
      style={{
        width: `${item.size.width}px`,
        height: `${item.size.height}px`,
        transform: `translate3d(${item.transform.x}px,${
          item.transform.y
        }px,0) rotate(${item.transform.r})`,
      }}
    >
      <Widget {...item.props} />
    </div>
  );
};

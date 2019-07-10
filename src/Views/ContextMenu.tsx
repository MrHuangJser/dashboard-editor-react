import React, { FC, Fragment } from "react";
import { IContextMenu, IContextMenuProps } from "../types";

export const ContextMenu: FC<IContextMenuProps> = props => {
  if (props && props.visible) {
    return (
      <div
        id="context-menu"
        style={{ left: props.position.x, top: props.position.y }}
        onClick={() => {
          props.onClose();
        }}
      >
        <section className="mb-contextmenu">
          <Menu menus={props.menus} action={props.onClick} />
        </section>
      </div>
    );
  }
  return null;
};

const Menu = (props: {
  menus: IContextMenu[];
  action: IContextMenuProps["onClick"];
  className?: string;
}) => {
  return (
    <ul className={props.className}>
      {props.menus.map(menu => {
        if (
          !menu.hidden ||
          (typeof menu.hidden === "function" && !menu.hidden())
        ) {
          return (
            <Fragment key={`contextmenu_item_${menu.key}`}>
              {menu.topDivider ? <div className="divider" /> : ""}
              <li
                onClick={() => {
                  props.action(menu);
                }}
              >
                <a>
                  <span>{menu.title}</span>
                  {menu.children && menu.children.length ? (
                    <i className="fa fa-caret-right" />
                  ) : (
                    ""
                  )}
                </a>
                {menu.children && menu.children.length ? (
                  <Menu
                    className="mb-contextmenu sub-menu"
                    menus={menu.children!}
                    action={props.action}
                  />
                ) : (
                  ""
                )}
              </li>
              {menu.bottomDivider ? <div className="divider" /> : ""}
            </Fragment>
          );
        }
      })}
    </ul>
  );
};

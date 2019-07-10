import { Dispatch, SetStateAction } from "react";

export interface IContextMenu {
  key: string;
  title: string;
  hidden?: (() => boolean) | boolean;
  topDivider?: boolean;
  bottomDivider?: boolean;
  children?: IContextMenu[];
}
export interface IContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  menus: IContextMenu[];
  onClick: (menu: IContextMenu) => void | any;
  onClose: () => void;
}

export interface IContextMenuContext {
  setContextMenuProps?: Dispatch<SetStateAction<IContextMenuProps | undefined>>;
}

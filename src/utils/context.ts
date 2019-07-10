import { createContext } from "react";
import { IContextMenuContext } from "../types";

export const ContextMenuContext = createContext<IContextMenuContext>({
  setContextMenuProps: () => ""
});

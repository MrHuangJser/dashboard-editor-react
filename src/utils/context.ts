import { createContext } from "react";
import { editorEvent } from "./event";

export const GlobalContext = createContext({
  emitter: editorEvent,
});

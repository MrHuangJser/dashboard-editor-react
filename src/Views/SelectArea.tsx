import React, { MutableRefObject } from "react";
import { useSelectAreaState } from "../components/SelectArea";

export const SelectAreaView: React.FC<{
  domRef: MutableRefObject<HTMLElement | undefined>;
}> = ({ domRef }) => {
  const { left, top, width, height, status } = useSelectAreaState({ domRef });

  return (
    <div
      className="select-area"
      style={{
        display: status === "moving" ? "block" : "none",
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
      }}
    />
  );
};

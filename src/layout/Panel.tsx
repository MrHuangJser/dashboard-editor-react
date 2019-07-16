import React, { FC, useState } from "react";

import ArrowIcon from "../assets/left-arrow.svg";

export const Panel: FC<{ title: string | JSX.Element }> = ({
  title,
  children
}) => {
  const [show, setVisible] = useState(true);
  return (
    <div className={`panel ${show ? "" : "close"}`}>
      <div className="panel-title">
        <div className="title-content">{title}</div>
        <div
          className="arrow"
          onClick={() => {
            setVisible(!show);
          }}
        >
          <ArrowIcon className="svg-icon" />
        </div>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
};

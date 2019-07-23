import { InputNumber } from "antd";
import React from "react";
import { WidgetProps } from "react-jsonschema-form";

export default (props: WidgetProps) => {
  const { onChange, value, required, disabled, autofocus, options } = props;

  return (
    <InputNumber
      {...{
        onChange: val => onChange(val),
        value,
        required,
        disabled,
        autoFocus: autofocus
      }}
      {...options as any}
    />
  );
};

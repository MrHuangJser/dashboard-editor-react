import { Input } from "antd";
import React from "react";
import { WidgetProps } from "react-jsonschema-form";

export default (props: WidgetProps) => {
  const {
    id,
    onChange,
    disabled,
    options,
    value,
    schema: { description }
  } = props;

  return (
    <Input
      {...{ onChange, disabled, id, value, placeholder: description }}
      {...options as any}
    />
  );
};

import { Input } from "antd";
import React from "react";
import { WidgetProps } from "react-jsonschema-form";

export default (props: WidgetProps) => {
  const {
    id,
    onChange,
    disabled,
    options: { type, size, prefix, addonAfter, addonBefore, suffix, allowClear },
    value,
    schema: { description }
  } = props;

  return (
    <Input
      {...{
        onChange: e => onChange(e.target.value),
        disabled,
        id,
        value,
        placeholder: description
      }}
      {...{ type, size, prefix, addonAfter, addonBefore, suffix, allowClear } as any}
    />
  );
};

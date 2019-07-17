import { Select } from "antd";
import React from "react";
import { WidgetProps } from "react-jsonschema-form";

export default (props: WidgetProps) => {
  const { onChange, value, disabled, id, options, schema } = props;
  return (
    <Select
      {...{ onChange, value, disabled, id, placeholder: schema.description }}
      {...options as any}
    >
      {schema.enum
        ? schema.enum.map((i, index) => {
            const { label, value: val } = i as { label: string; value: any };
            return (
              <Select.Option key={`label_${index}`} title={label} value={val}>
                {label}
              </Select.Option>
            );
          })
        : ""}
    </Select>
  );
};

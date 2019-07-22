import { Col, Row } from "antd";
import React from "react";
import { FieldTemplateProps, ObjectFieldTemplateProps } from "react-jsonschema-form";

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { uiSchema } = props;
  const { "ui:options": options } = uiSchema;
  const safeOptions = (options || {}) as { [key: string]: any };
  return (
    <div className="d-flex align-items-center">
      {!safeOptions.hideLabel && props.title ? (
        <span className={`mr-2 ${safeOptions.labelSpan || ""}`} style={{ width: safeOptions.labelFixed }}>
          {props.title}
        </span>
      ) : (
        ""
      )}
      <div className="col pl-1 pr-1">
        <Row
          className="mb-2"
          gutter={props.uiSchema["ui:options"] ? (props.uiSchema["ui:options"].gutter as number) : undefined}
        >
          {props.properties.map(element => element.content)}
        </Row>
      </div>
    </div>
  );
};

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { classNames, label, help, description, errors, children, uiSchema } = props;

  const { "ui:options": options } = uiSchema;
  const safeOptions = (options || {}) as { [key: string]: any };
  return (
    <Col className="mb-2" span={safeOptions.span}>
      <div className={`d-flex align-items-center ${classNames}`}>
        {!safeOptions.hideLabel && label ? (
          <span
            className={`mr-2 text-${safeOptions.labelAlign || "right"}`}
            style={{ width: safeOptions.labelFixed }}
          >
            {label}
          </span>
        ) : (
          ""
        )}
        <div className="col pl-1 pr-1">
          {description}
          {children}
          {errors}
          {help}
        </div>
      </div>
    </Col>
  );
};

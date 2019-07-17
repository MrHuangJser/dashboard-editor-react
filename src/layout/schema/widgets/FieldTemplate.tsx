import { Col, Row } from "antd";
import React from "react";
import {
  FieldTemplateProps,
  ObjectFieldTemplateProps
} from "react-jsonschema-form";

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { uiSchema } = props;
  let { "ui.options": options } = uiSchema;
  options = options || {};

  return (
    <div className="d-flex align-items-center">
      {!options.hideLabel ? (
        <span className={`mr-2 ${options.labelSpan || ""}`}>{props.title}</span>
      ) : (
        ""
      )}
      <div className="col pl-1 pr-1">
        <Row
          className="mb-2"
          gutter={
            props.uiSchema["ui:options"]
              ? (props.uiSchema["ui:options"].gutter as number)
              : undefined
          }
        >
          {props.properties.map(element => element.content)}
        </Row>
      </div>
    </div>
  );
};

export const FieldTemplate = (props: FieldTemplateProps) => {
  const {
    classNames,
    label,
    help,
    description,
    errors,
    children,
    uiSchema
  } = props;
  return (
    <Col
      className="mb-2"
      span={
        props.uiSchema["ui:options"]
          ? (props.uiSchema["ui:options"].span as number)
          : undefined
      }
    >
      <div className={`d-flex align-items-center ${classNames}`}>
        {!uiSchema["ui:options"] || !uiSchema["ui:options"].hideLabel ? (
          <span className="mr-2">{label}</span>
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

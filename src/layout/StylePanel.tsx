import { Collapse } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import Form from "react-jsonschema-form";
import { Subscription } from "rxjs";
import { delay } from "rxjs/operators";
import { Editor } from "../core";
import { canvasSchema } from "./schema/canvas";
import widgets, { FieldTemplate, ObjectFieldTemplate } from "./schema/widgets";

export const StylePanel: FC<{ editor: Editor | null }> = ({ editor }) => {
  const { formRef, canvasFormData } = useStylePanelState(editor);
  return (
    <div className="style-panel">
      <Collapse bordered={false} activeKey="base_attr">
        <Collapse.Panel key="base_attr" header="基础属性">
          <Form
            ref={ref => {
              if (ref) {
                formRef.current = ref;
              }
            }}
            formData={canvasFormData}
            schema={canvasSchema.schema}
            uiSchema={canvasSchema.uiSchema}
            widgets={widgets}
            ObjectFieldTemplate={ObjectFieldTemplate}
            FieldTemplate={FieldTemplate}
            onChange={val => {
              if (val.edit) {
              }
            }}
          >
            <div />
          </Form>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export function useStylePanelState(editor: Editor | null) {
  const formRef = useRef<any | null>(null);
  const [canvasFormData, setCanvasFormData] = useState<any>();

  useEffect(() => {
    let event: Subscription;
    if (editor && formRef.current) {
      const { canvasSize, canvasTransform } = editor;
      setCanvasFormData({ ...canvasSize, ...canvasTransform });
      event = editor.bus.pipe(delay(50)).subscribe(() => {
        setCanvasFormData({ ...editor.canvasSize, ...editor.canvasTransform });
      });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [editor, formRef]);

  return {
    formRef,
    canvasFormData
  };
}

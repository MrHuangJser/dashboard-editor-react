import { Collapse } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import Form from "react-jsonschema-form";
import { Subscription } from "rxjs";
import { delay } from "rxjs/operators";
import { Editor } from "../core";
import { canvasSchema } from "./schema/canvas";
import widgets, { FieldTemplate, ObjectFieldTemplate } from "./schema/widgets";

export const StylePanel: FC<{ editor: Editor | null }> = ({ editor }) => {
  const { formRef, canvasFormData, updateCanvas } = useStylePanelState(editor);
  return (
    <div className="style-panel">
      <Collapse bordered={false} defaultActiveKey="base_attr">
        <Collapse.Panel key="base_attr" header="画布属性">
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
                updateCanvas(val.formData);
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

  const updateCanvas = (data: any) => {
    if (editor) {
      editor.emit({ type: "SET_CANVAS_SIZE", payload: data });
    }
  };

  return {
    formRef,
    canvasFormData,
    updateCanvas
  };
}

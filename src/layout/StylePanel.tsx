import { Collapse } from "antd";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";
import Form from "react-jsonschema-form";
import { Subscription } from "rxjs";
import { delay } from "rxjs/operators";
import { Editor, Group, Item } from "../core";
import { IWidgetProps, WidgetPropsSchemeMap } from "../Widgets";
import { canvasSchema } from "./schema/canvas";
import { itemSchema } from "./schema/item";
import formWidgets, { FieldTemplate, ObjectFieldTemplate } from "./schema/widgets";

export const StylePanel: FC<{ editor: Editor | null }> = ({ editor }) => {
  const [canvasFormData, updateCanvas] = useCanvasStylePanelState(editor);
  const [itemBaseStyle, updateItemBaseStyle] = useBaseItemStylePanelState(editor);
  const [customItemStyle, updateCustomItemStyle, item] = useCustomItemStylePanelState(editor);

  return (
    <div className="style-panel">
      <Collapse bordered={false} defaultActiveKey="canvas_attr">
        <Collapse.Panel key="canvas_attr" header="画布属性">
          <Form
            formData={canvasFormData}
            schema={canvasSchema.schema}
            uiSchema={canvasSchema.uiSchema}
            widgets={formWidgets}
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
        <Collapse.Panel key="base_item_attr" header="组件基础属性">
          <Form
            formData={itemBaseStyle}
            schema={itemSchema.schema}
            uiSchema={itemSchema.uiSchema}
            widgets={formWidgets}
            ObjectFieldTemplate={ObjectFieldTemplate}
            FieldTemplate={FieldTemplate}
            onChange={val => {
              if (val.edit) {
                updateItemBaseStyle(val.formData);
              }
            }}
          >
            <div />
          </Form>
        </Collapse.Panel>
        {item && item.type !== "GROUP" ? (
          <Collapse.Panel key="custom_item_attr" header="组件属性">
            <Form
              formData={customItemStyle}
              schema={WidgetPropsSchemeMap[item.type].schema}
              uiSchema={WidgetPropsSchemeMap[item.type].uiSchema}
              widgets={formWidgets}
              ObjectFieldTemplate={ObjectFieldTemplate}
              FieldTemplate={FieldTemplate}
              onChange={val => {
                if (val.edit) {
                  updateCustomItemStyle(val.formData);
                }
              }}
            >
              <div />
            </Form>
          </Collapse.Panel>
        ) : (
          ""
        )}
      </Collapse>
    </div>
  );
};

function useCanvasStylePanelState(editor: Editor | null): [any, (data: any) => void] {
  const [canvasFormData, setCanvasFormData] = useState<any>();

  useEffect(() => {
    let event: Subscription;
    if (editor) {
      const { canvasSize, canvasTransform } = editor;
      setCanvasFormData({ ...canvasSize, ...canvasTransform });
      event = editor
        .on(["SET_CANVAS_SIZE"])
        .pipe(delay(100))
        .subscribe(() => {
          setCanvasFormData({ ...editor.canvasSize });
        });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [editor]);

  const updateCanvas = (data: any) => {
    if (editor) {
      editor.emit({ type: "SET_CANVAS_SIZE", payload: data });
    }
  };

  return [canvasFormData, updateCanvas];
}

let groupStart: Group | null = null;
const itemMapStart: Map<Item, { r: number; x: number; y: number; width: number; height: number }> = new Map();
function useBaseItemStylePanelState(
  editor: Editor | null
): [
  { transform: Item["transform"]; size: Item["size"] } | undefined,
  Dispatch<{ transform: Item["transform"]; size: Item["size"] }>
] {
  const [itemBaseStyle, setItemBaseStyle] = useState<{ transform: Item["transform"]; size: Item["size"] }>();

  useEffect(() => {
    let event: Subscription;
    if (editor) {
      event = editor
        .on([
          "SELECT_ITEM",
          "SELECT_GROUP",
          "UN_SELECT_ITEM",
          "UN_GROUP_ITEM",
          "MOVE_ITEM",
          "ROTATE_ITEM",
          "RESIZE_ITEM"
        ])
        .pipe(delay(100))
        .subscribe(() => {
          const {
            selected,
            canvasTransform: { s },
            canvasSize
          } = editor;
          groupStart = new Group(s, [...selected], canvasSize);
          itemMapStart.clear();
          if (groupStart.show) {
            selected.forEach(item => {
              itemMapStart.set(item, { ...item.transform, ...item.size });
            });
            setItemBaseStyle({
              transform: {
                r: groupStart.transform.r,
                x: (groupStart.transform.x * canvasSize.width) / 100,
                y: (groupStart.transform.y * canvasSize.height) / 100
              },
              size: {
                width: (groupStart.size.width * canvasSize.width) / 100,
                height: (groupStart.size.height * canvasSize.height) / 100
              }
            });
          } else {
            groupStart = null;
            setItemBaseStyle(undefined);
          }
        });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [editor]);

  const updateItemBaseStyle = (data: { transform: Item["transform"]; size: Item["size"] }) => {
    if (editor && groupStart) {
      const { transform, size } = data;
      const { canvasSize } = editor;
      const increaseX = transform.x - (groupStart.transform.x * canvasSize.width) / 100;
      const increaseY = transform.y - (groupStart.transform.y * canvasSize.height) / 100;
      const increaseW = size.width - (groupStart.size.width * canvasSize.width) / 100;
      const increaseH = size.height - (groupStart.size.height * canvasSize.height) / 100;

      const itemMap = new Map<
        Item,
        { x: number; y: number; mx: number; my: number; width: number; height: number }
      >();
      itemMapStart.forEach(({ x, y, width, height }, item) => {
        itemMap.set(item, {
          x: x + increaseX,
          y: y + increaseY,
          mx: increaseX,
          my: increaseY,
          width: width + increaseW,
          height: height + increaseH
        });
      });

      editor.emit({ type: "MOVE_ITEM", payload: itemMap });
      editor.emit({ type: "RESIZE_ITEM", payload: itemMap });
      if (itemMap.size === 1) {
        editor.emit({ type: "ROTATE_ITEM", payload: { item: itemMap.keys().next().value, r: transform.r } });
      }
    }
  };

  return [itemBaseStyle, updateItemBaseStyle];
}

let itemSet: Set<Item> | null = null;
function useCustomItemStylePanelState<K extends keyof IWidgetProps>(
  editor: Editor | null
): [IWidgetProps[K] | undefined, (data: IWidgetProps[K]) => void, Item | null] {
  const [itemProps, setItemProps] = useState<IWidgetProps[K]>();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    let event: Subscription;
    if (editor) {
      event = editor.bus.pipe(delay(100)).subscribe(() => {
        itemSet = editor.selected;
        if (itemSet.size === 1) {
          setItem(itemSet.values().next().value);
          setItemProps(itemSet.values().next().value.props);
        } else {
          setItem(null);
        }
      });
    }
    return () => {
      if (event) {
        event.unsubscribe();
      }
    };
  }, [editor]);

  const updateItemProps = (data: IWidgetProps[K]) => {
    if (editor && itemSet && itemSet.size === 1) {
      editor.emit({ type: "SET_ITEM_DATA", payload: { id: itemSet.values().next().value.id, data } });
    }
  };

  return [itemProps, updateItemProps, item];
}

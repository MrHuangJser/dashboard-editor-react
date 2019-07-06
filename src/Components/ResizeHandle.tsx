import { useMappedState } from "../utils";

export function useResizeHandleState() {
  const { selectedItems, scale } = useMappedState(
    ({ editorInstance, selected }) => ({
      selectedItems: [...selected],
      scale: editorInstance.canvasTransform.s,
      x: editorInstance.canvasTransform.x,
      y: editorInstance.canvasTransform.y
    })
  );
  const item = selectedItems.length ? selectedItems[0] : null;

  console.log(selectedItems);

  return {
    show: selectedItems.length,
    x: item ? item.transform.x * scale : 0,
    y: item ? item.transform.y * scale : 0,
    width: item ? item.size.width * scale : 0,
    height: item ? item.size.height * scale : 0
  };
}

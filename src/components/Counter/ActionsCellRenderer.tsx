import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent, useCallback } from "react";


export const ActionsCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ api, node, context }) => {
  const onRemoveClick = useCallback(() => {
    const rowData = node.data;
    api.applyTransaction({ remove: [rowData] });
  }, [node, api]);

  const onEditClick = useCallback(() => {
    console.log("context change")
    const rowData = node.data;
    if (context?.openEditModal && rowData) {
      context.openEditModal(rowData);
    }
  }, [context]);

  return (
    <div>
      <button
        className={`button-secondary`}
        onClick={onRemoveClick}
      >
        Delete
      </button>
      <button
        className={`button-primary`}
        onClick={onEditClick}
      >
        Edit
      </button>
    </div>
  );
};

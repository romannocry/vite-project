import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import styles from "./StatusCellRenderer.module.css";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
  valueFormatted,
}) =>
  value ? (
    <div className={`${styles.tag} ${styles[value + "Tag"]}`}>
      <div className={`${styles.circle} ${styles[value + "Circle"]}`}></div>
      <span>{value}</span>
    </div>
  ) : null; 

export const StatusCellRenderer2 = ({ value, valueFormatted, data }: CustomCellRendererProps) => {
  return <span>{value}</span>;
};

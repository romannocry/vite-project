import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import styles from "./StatusCellRenderer.module.css";

export const StatusCellRenderer2: FunctionComponent<CustomCellRendererProps> = ({
  value,
  valueFormatted,
}) => (
  <div className={`${styles.tag} ${styles[value + "Tag"]}`}>
    <div className={`${styles.circle} ${styles[value + "Circle"]}`}>xx</div>
    <span>{valueFormatted}</span>
  </div>
);

export const StatusCellRenderer = ({ value, valueFormatted, data }: CustomCellRendererProps) => {
  return <span>{valueFormatted || value}</span>;
};
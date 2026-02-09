import type { IHeaderParams } from "ag-grid-community";
import { FiClock } from "react-icons/fi";

export function SinceHeader() {
  return (
    <div
      title="Since last meeting (days)"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}
    >
      <FiClock size={14} />
    </div>
  );
}

export function WeekHeader(params: IHeaderParams) {
  const colId = params.column?.getColId?.() ?? "";
  const [year, wPart] = colId.split("-W");
  if (!year || !wPart) {
    return <span>{params.displayName}</span>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div style={{ textAlign: "center", lineHeight: 1.1 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{`W${wPart}`}</div>
        <div style={{ fontSize: 11, color: "#666" }}>{year}</div>
      </div>
    </div>
  );
}

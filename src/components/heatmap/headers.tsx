import type { IHeaderParams } from "ag-grid-community";
import { FiClock } from "react-icons/fi";

export function SinceHeader(params: IHeaderParams) {
  const canSort = Boolean((params as any).enableSorting);
  const sort = params.column?.getSort?.() ?? null;

  return (
    <div
      title="Since last update (days)"
      role={canSort ? "button" : undefined}
      tabIndex={canSort ? 0 : undefined}
      onClick={() => {
        if (!canSort) return;
        (params as any).progressSort?.();
      }}
      onKeyDown={(e) => {
        if (!canSort) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          (params as any).progressSort?.();
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        cursor: canSort ? "pointer" : "default",
        userSelect: "none",
        gap: 6,
      }}
    >
      <FiClock size={14} />
      <span style={{ fontSize: 11, color: "#666", minWidth: 10, textAlign: "left" }}>
        {sort === "asc" ? "↑" : sort === "desc" ? "↓" : ""}
      </span>
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

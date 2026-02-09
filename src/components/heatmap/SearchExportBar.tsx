import { memo } from "react";

export const SearchExportBar = memo(function SearchExportBar({
  value,
  onChange,
  onDownloadCsv,
}: {
  value: string;
  onChange: (v: string) => void;
  onDownloadCsv: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        width: "100%",
        maxWidth: 720,
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search client, team, status, comments…"
        aria-label="Search"
        style={{
          flex: "1 1 auto",
          minWidth: 220,
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #ddd",
          outline: "none",
        }}
      />
      <button
        type="button"
        onClick={onDownloadCsv}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #111",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Download CSV
      </button>
    </div>
  );
});

import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FiEdit3 } from "react-icons/fi";

import { enrichment as initialEnrichment, meetings } from "./Data";
import type { Enrichment } from "./Data";
import { useHeatmapData } from "./useHeatmapData";
import type { InteractionCell } from "./useHeatmapData";
import { EnrichmentEditorModal, feelingToStore, statusToStore } from "./EnrichmentEditorModal";
import { MeetingsModal } from "./MeetingsModal";
import { SearchExportBar } from "./SearchExportBar";
import { SinceHeader, WeekHeader } from "./headers";
import {
  formatCreatedAtLocal,
  formatDateLocal,
  formatDateUTC,
  formatSinceDays,
  getISOWeekYear,
  parseCreatedAtLocal,
} from "./utils";
import type {
  HoveredCellState,
  OverlayEditorState,
  OverlayFeeling,
  OverlayStatus,
  WeekCellValue,
} from "./heatmapUiTypes";

export default function ClientTeamHeatmap() {
  const rows = useHeatmapData(meetings);

  const [groupBy, setGroupBy] = useState<"none" | "client" | "team" | "status">("none");

  const rowKeyFrom = (r: { client_id: string; team: string }) => {
    return `${r.client_id}__${r.team}`;
  };

  const rowKeyBaseFrom = (r: { client_id: string; team: string }) => {
    return `${r.client_id}__${r.team}`;
  };

  const [uiEnrichment, setUiEnrichment] = useState<Enrichment[]>([]);
  const enrichmentState = useMemo(() => {
    // Source of truth is Data.tsx; UI additions are in-memory only.
    return [...initialEnrichment, ...uiEnrichment];
  }, [uiEnrichment]);
  const [overlayEditor, setOverlayEditor] = useState<OverlayEditorState>(null);

  const [searchText, setSearchText] = useState("");

  const cellKeyFrom = (rowKey: string, weekKey: string) => `${rowKey}||${weekKey}`;

  const gridApiRef = useRef<GridApi | null>(null);

  // Create a contiguous sequence of ISO-week keys between min and max week
  // Use the raw `meetings` dates to compute min/max so every meeting is included
  const weekSequence = useMemo(() => {
    const validDates = meetings
      .map((m) => parseCreatedAtLocal(m.created_at))
      .filter((d) => !isNaN(d.getTime()))
      .map((d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())));
    if (validDates.length === 0) return [] as { key: string; date: Date }[];
    const minDate = new Date(Math.min(...validDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...validDates.map((d) => d.getTime())));

    const startOfWeek = (d: Date) => {
      const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      const day = (date.getUTCDay() + 6) % 7; // Monday=0
      date.setUTCDate(date.getUTCDate() - day);
      return date;
    };

    const seq: { key: string; date: Date }[] = [];
    let cur = startOfWeek(minDate);
    const end = startOfWeek(maxDate);

    while (cur.getTime() <= end.getTime()) {
      const { year, week } = getISOWeekYear(cur);
      const key = `${year}-W${String(week).padStart(2, "0")}`;
      seq.push({ key, date: new Date(cur) });
      cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth(), cur.getUTCDate() + 7));
    }
    return seq;
  }, [meetings]);

  // Show most recent weeks first
  const weekKeys = weekSequence.map((s) => s.key).slice().reverse();

  // current week key for highlight
  const now = new Date();

  // Use the local calendar day for the current-week highlight.
  // This avoids UTC rollover (e.g. Sunday evening local time becoming Monday in UTC).
  const curWK = (() => {
    const localDay = new Date(formatDateLocal(new Date()));
    const { year, week } = getISOWeekYear(localDay);
    return `${year}-W${String(week).padStart(2, "0")}`;
  })();

  const normalizedEnrichment = useMemo(() => {
    const out: Array<{
      client_id: string;
      team: string;
      date: Date;
      status?: Enrichment["status"];
      comment?: string;
      feeling?: Enrichment["feeling"];
    }> = [];

    for (const e of enrichmentState) {
      const d = parseCreatedAtLocal(e.created_at);
      if (isNaN(d.getTime())) continue;
      const teams = e.participant_team.split(",").map((t) => t.trim()).filter(Boolean);
      for (const team of teams) {
        out.push({
          client_id: e["iC ID Top Account"],
          team,
          date: d,
          status: e.status,
          comment: e.comment,
          feeling: e.feeling,
        });
      }
    }
    return out;
  }, [enrichmentState]);

  const statusByRowKey = useMemo(() => {
    const map: Record<string, { status: OverlayStatus; ts: number; idx: number }> = {};
    normalizedEnrichment.forEach((e, idx) => {
      const s = typeof e.status === "string" ? e.status.trim() : "";
      if (!s) return;
      const rk = rowKeyBaseFrom({ client_id: e.client_id, team: e.team });
      const ts = e.date.getTime();

      const prev = map[rk];
      if (!prev || ts > prev.ts || (ts === prev.ts && idx > prev.idx)) {
        map[rk] = { status: s as OverlayStatus, ts, idx };
      }
    });

    return Object.fromEntries(Object.entries(map).map(([rk, v]) => [rk, v.status]));
  }, [normalizedEnrichment]);

  const commentsByCellKey = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const e of normalizedEnrichment) {
      const c = typeof e.comment === "string" ? e.comment.trim() : "";
      if (!c) continue;
      const { year, week } = getISOWeekYear(e.date);
      const wk = `${year}-W${String(week).padStart(2, "0")}`;
      const rk = rowKeyBaseFrom({ client_id: e.client_id, team: e.team });
      const ck = cellKeyFrom(rk, wk);
      if (!map[ck]) map[ck] = [];
      map[ck].push(e.comment ?? "");
    }
    return map;
  }, [normalizedEnrichment]);

  useEffect(() => {
    // Row data doesn't change when only comments/status change; explicitly redraw
    // so React cell renderers re-evaluate derived maps.
    const api = gridApiRef.current ?? gridRef.current?.api;
    if (!api) return;
    api.redrawRows();
    api.refreshCells({ force: true });
    api.refreshHeader();
  }, [commentsByCellKey, statusByRowKey]);

  const rowHasAnyComment = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const [ck, vals] of Object.entries(commentsByCellKey)) {
      if (!Array.isArray(vals) || vals.length === 0) continue;
      const rk = ck.split("||")[0] ?? "";
      if (!rk) continue;
      map[rk] = true;
    }
    return map;
  }, [commentsByCellKey]);

  const latestCommentByRowKey = useMemo(() => {
    const best: Record<string, { ts: number; idx: number; comment: string }> = {};

    normalizedEnrichment.forEach((e, idx) => {
      const comment = typeof e.comment === "string" ? e.comment.trim() : "";
      if (!comment) return;
      const rk = rowKeyBaseFrom({ client_id: e.client_id, team: e.team });
      const ts = e.date.getTime();

      const prev = best[rk];
      if (!prev || ts > prev.ts || (ts === prev.ts && idx > prev.idx)) {
        best[rk] = { ts, idx, comment: e.comment ?? "" };
      }
    });

    return Object.fromEntries(Object.entries(best).map(([rk, v]) => [rk, v.comment]));
  }, [normalizedEnrichment]);

  const feelingByRowKey = useMemo(() => {
    const best: Record<string, { ts: number; idx: number; feeling: NonNullable<Enrichment["feeling"]> }> = {};

    normalizedEnrichment.forEach((e, idx) => {
      const f = typeof e.feeling === "string" ? e.feeling.trim() : "";
      if (!f) return;
      const rk = rowKeyBaseFrom({ client_id: e.client_id, team: e.team });
      const ts = e.date.getTime();

      const prev = best[rk];
      if (!prev || ts > prev.ts || (ts === prev.ts && idx > prev.idx)) {
        best[rk] = { ts, idx, feeling: f as NonNullable<Enrichment["feeling"]> };
      }
    });

    return Object.fromEntries(Object.entries(best).map(([rk, v]) => [rk, v.feeling]));
  }, [normalizedEnrichment]);

  // modal state (click-to-open)
  const [hovered, setHovered] = useState<HoveredCellState>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const containerStyle = { padding: 20 } as const;

  type HeatmapGridRow = {
    client_id: string;
    client_name?: string;
    team: string;
    status: string;
    firstMeeting: string;
    sinceLastMeeting: string;
    weekMeetings: Record<string, InteractionCell[]>;
    weekCounts: Record<string, number>;
  };

  const rowData: HeatmapGridRow[] = useMemo(() => {
    return rows.map((row) => {
      const key = rowKeyFrom(row);
      const baseKey = rowKeyBaseFrom({ client_id: row.client_id, team: row.team });
      const status = statusByRowKey[key] ?? statusByRowKey[baseKey] ?? (row.status as OverlayStatus) ?? "ongoing";

      const weekMeetings: Record<string, InteractionCell[]> = {};
      const dates: Date[] = [];

      Object.values(row.cells).forEach((cell) => {
        if (isNaN(cell.date.getTime())) return;
        dates.push(cell.date);
        const { year, week } = getISOWeekYear(cell.date);
        const weekKey = `${year}-W${String(week).padStart(2, "0")}`;
        if (!weekMeetings[weekKey]) weekMeetings[weekKey] = [];
        weekMeetings[weekKey].push(cell);
      });

      const weekCounts = Object.fromEntries(Object.entries(weekMeetings).map(([k, v]) => [k, v.length]));

      const firstMeeting = dates.length
        ? formatDateUTC(new Date(Math.min(...dates.map((d) => d.getTime()))))
        : "—";

      const last = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : null;
      const daysSince = last ? Math.floor((now.getTime() - last.getTime()) / 86400000) : NaN;

      return {
        client_id: row.client_id,
        client_name: row.client_name,
        team: row.team,
        status,
        firstMeeting,
        sinceLastMeeting: formatSinceDays(daysSince),
        weekMeetings,
        weekCounts,
      };
    });
  }, [rows, weekKeys.length, statusByRowKey]);

  const gridRef = useRef<AgGridReact<HeatmapGridRow> | null>(null);

  // derived above from enrichment

  const WeekSquareRenderer = (params: ICellRendererParams<HeatmapGridRow, WeekCellValue>) => {
    const weekKey = params.column?.getColId?.() ?? params.colDef?.colId ?? "";
    const count = typeof params.value?.count === "number" ? params.value.count : 0;
    const has = count > 0;
    const comments = Array.isArray(params.value?.comments) ? params.value.comments : [];
    const hasComment = comments.some((c) => typeof c === "string" && c.trim().length > 0);
    const squareStyle = {
      width: 12,
      height: 12,
      backgroundColor: has ? "#16a34a" : "#ebedf0",
      borderRadius: 2,
      border: !has && hasComment ? "1px solid #7c3aed" : undefined,
      boxShadow: has && hasComment ? "0 0 0 1px #7c3aed" : undefined,
      cursor: has || hasComment ? "pointer" : "default",
    } as const;

    return (
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 12, height: 12 }}>
          <div
            style={squareStyle}
            onClick={() => {
              if (!weekKey || !params.data) return;
              const interactions = params.data.weekMeetings?.[weekKey] ?? [];
              setHovered({
                client_id: params.data.client_id,
                client_name: params.data.client_name,
                team: params.data.team,
                rowKey: rowKeyBaseFrom({ client_id: params.data.client_id, team: params.data.team }),
                weekKey,
                interactions,
              });
              setModalOpen(true);
            }}
            title={
              has
                ? `${count} meeting(s)${hasComment ? " • note" : ""}`
                : hasComment
                  ? "note"
                  : ""
            }
          />
          {hasComment ? (
            <div
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 5,
                height: 5,
                borderRadius: 999,
                background: "#7c3aed",
                boxShadow: "0 0 0 1px #fff",
                pointerEvents: "none",
              }}
            />
          ) : null}
        </div>
      </div>
    );
  };

  const pinnedLeftCols: ColDef<HeatmapGridRow>[] = useMemo(
    () => [
      {
        headerName: "",
        colId: "actions",
        pinned: "left",
        width: 54,
        suppressCsvExport: true,
        suppressMenu: true,
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<HeatmapGridRow>) => {
          const row = params.data;
          if (!row) return null;
          if (params.node.group) return null;

          const key = rowKeyFrom(row);
          const baseKey = rowKeyBaseFrom({ client_id: row.client_id, team: row.team });
          const hasAny = Boolean(rowHasAnyComment[key] || rowHasAnyComment[baseKey]);

          return (
            <button
              type="button"
              onClick={() => {
                const existingStatus =
                  statusByRowKey[key] ?? statusByRowKey[baseKey] ?? (row.status as OverlayStatus) ?? "ongoing";

                setOverlayEditor({
                  row: { client_id: row.client_id, team: row.team },
                  status: existingStatus,
                  feeling: (feelingByRowKey[baseKey] ?? "") as OverlayFeeling,
                  newComment: "",
                });
              }}
              title={hasAny ? "Edit status / add week note (row has notes)" : "Edit status / add week note"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid #ddd",
                background: hasAny ? "#f5f3ff" : "#fff",
                cursor: "pointer",
                marginLeft: 8,
              }}
            >
              <FiEdit3 size={16} />
            </button>
          );
        },
      },
      {
        headerName: "Client",
        field: "client_id",
        pinned: "left",
        width: 90,
        enableRowGroup: true,
        rowGroup: groupBy === "client",
        hide: groupBy === "client",
      },
      /*{
        headerName: "Client Name",
        field: "client_name",
        pinned: "left",
        width: 90,
        enableRowGroup: true
      },*/
      {
        headerName: "Team",
        field: "team",
        pinned: "left",
        width: 140,
        enableRowGroup: true,
        rowGroup: groupBy === "team",
        hide: groupBy === "team",
      },
      {
        headerName: "Status",
        colId: "status",
        pinned: "left",
        width: 120,
        enableRowGroup: true,
        rowGroup: groupBy === "status",
        hide: groupBy === "status",
        valueGetter: (p) => {
          const row = p.data;
          if (!row) return "";
          const key = rowKeyFrom(row);
          const baseKey = rowKeyBaseFrom({ client_id: row.client_id, team: row.team });
          return statusByRowKey[key] ?? statusByRowKey[baseKey] ?? row.status ?? "ongoing";
        },
      },
      {
        headerName: "Latest comment",
        colId: "latestComment",
        pinned: "left",
        width: 260,
        valueGetter: (p) => {
          const row = p.data;
          if (!row) return "";
          const baseKey = rowKeyBaseFrom({ client_id: row.client_id, team: row.team });
          return latestCommentByRowKey[baseKey] ?? "";
        },
        tooltipValueGetter: (p) => {
          const row = p.data;
          if (!row) return "";
          const baseKey = rowKeyBaseFrom({ client_id: row.client_id, team: row.team });
          return latestCommentByRowKey[baseKey] ?? "";
        },
        cellStyle: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
      { headerName: "First meeting", field: "firstMeeting", pinned: "left", width: 140 },
      {
        headerName: "",
        headerTooltip: "Since last meeting (days)",
        headerComponent: SinceHeader,
        field: "sinceLastMeeting",
        pinned: "left",
        width: 88,
      },
    ],
    [groupBy, latestCommentByRowKey, rowHasAnyComment, statusByRowKey]
  );

  const weekCols: ColDef<HeatmapGridRow>[] = useMemo(() => {
    return weekKeys.map((wk) => {
      const [year, wPart] = wk.split("-W");
      const headerName = `W${wPart}`;
      const isCurrent = wk === curWK;

      return {
        colId: wk,
        headerName,
        headerTooltip: year,
        headerComponent: WeekHeader,
        width: 38,
        suppressMenu: true,
        sortable: false,
        filter: false,
        resizable: false,
        headerClass: isCurrent ? "heatmap-current-week" : undefined,
        valueGetter: (p) => {
          const count = p.data?.weekCounts?.[wk] ?? 0;
          const row = p.data;
          if (!row) return { count, comments: [] } as WeekCellValue;

          const rowKey = rowKeyFrom(row);
          const baseKey = rowKeyBaseFrom({ client_id: row.client_id, team: row.team });
          const comments =
            commentsByCellKey[cellKeyFrom(rowKey, wk)] ??
            commentsByCellKey[cellKeyFrom(baseKey, wk)] ??
            [];

          return { count, comments } as WeekCellValue;
        },
        cellRenderer: WeekSquareRenderer,
        cellStyle: {
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      };
    });
  }, [weekKeys.join("|"), curWK, commentsByCellKey]);

  const columnDefs: ColDef<HeatmapGridRow>[] = useMemo(() => {
    return [...pinnedLeftCols, ...weekCols];
  }, [pinnedLeftCols, weekCols]);

  const defaultColDef: ColDef<HeatmapGridRow> = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const downloadCsv = () => {
    const api = gridApiRef.current ?? gridRef.current?.api;
    if (!api) return;

    api.exportDataAsCsv({
      fileName: `heatmap-${formatDateLocal(new Date())}.csv`,
      skipRowGroups: true,
      allColumns: true,
      processCellCallback: (p) => {
        const v = p.value as unknown;
        if (v && typeof v === "object") {
          const anyV = v as any;
          if (typeof anyV.count === "number" && Array.isArray(anyV.comments)) {
            const count = anyV.count as number;
            const notes = (anyV.comments as unknown[]).filter((c) => typeof c === "string" && c.trim().length > 0)
              .length;
            return notes ? `${count} (${notes} note${notes === 1 ? "" : "s"})` : String(count);
          }
        }
        return v == null ? "" : String(v);
      },
    });
  };

  if (rows.length === 0) {
    return (
      <div style={containerStyle}>
        <h2>Client × Team Interaction Heatmap</h2>
        <p>No meeting data available.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2>Client × Team Interaction Heatmap</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#444" }}>Group by:</span>
        <button
          type="button"
          onClick={() => setGroupBy("none")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: groupBy === "none" ? "#111" : "#fff",
            color: groupBy === "none" ? "#fff" : "#111",
            cursor: "pointer",
          }}
        >
          None
        </button>
        <button
          type="button"
          onClick={() => setGroupBy("client")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: groupBy === "client" ? "#111" : "#fff",
            color: groupBy === "client" ? "#fff" : "#111",
            cursor: "pointer",
          }}
        >
          Client
        </button>
        <button
          type="button"
          onClick={() => setGroupBy("team")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: groupBy === "team" ? "#111" : "#fff",
            color: groupBy === "team" ? "#fff" : "#111",
            cursor: "pointer",
          }}
        >
          Team
        </button>
        <button
          type="button"
          onClick={() => setGroupBy("status")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: groupBy === "status" ? "#111" : "#fff",
            color: groupBy === "status" ? "#fff" : "#111",
            cursor: "pointer",
          }}
        >
          Status
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <SearchExportBar value={searchText} onChange={setSearchText} onDownloadCsv={downloadCsv} />
      </div>
      <div style={{ height: "70vh", width: "100%" }} className="ag-theme-quartz heatmap-grid">
        <AgGridReact<HeatmapGridRow>
          ref={gridRef as any}
          onGridReady={(e: GridReadyEvent) => {
            gridApiRef.current = e.api;
          }}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={searchText}
          rowHeight={28}
          headerHeight={44}
          animateRows
          groupDefaultExpanded={1}
          autoGroupColumnDef={{
            headerName:
              groupBy === "client"
                ? "Client"
                : groupBy === "team"
                  ? "Team"
                  : groupBy === "status"
                    ? "Status"
                    : "Group",
            pinned: "left",
            width: 220,
          }}
          suppressMovableColumns
          ensureDomOrder
          getRowId={(p) => `${p.data.client_id}__${p.data.team}`}
        />
      </div>

      {overlayEditor ? (
        <EnrichmentEditorModal
          overlayEditor={overlayEditor}
          onClose={() => setOverlayEditor(null)}
          curWK={curWK}
          existingComments={(() => {
            const rk = rowKeyBaseFrom({ client_id: overlayEditor.row.client_id, team: overlayEditor.row.team });
            return commentsByCellKey[cellKeyFrom(rk, curWK)] ?? [];
          })()}
          onChangeStatus={(s) =>
            setOverlayEditor((prev) => (prev ? { ...prev, status: s } : prev))
          }
          onChangeFeeling={(f) =>
            setOverlayEditor((prev) => (prev ? { ...prev, feeling: f } : prev))
          }
          onChangeNewComment={(v) =>
            setOverlayEditor((prev) => (prev ? { ...prev, newComment: v } : prev))
          }
          onSave={() => {
            if (!overlayEditor) return;
            const trimmedComment = overlayEditor.newComment.trim();
            const statusStore = statusToStore(overlayEditor.status);
            const feelingStore = feelingToStore(overlayEditor.feeling);

            if (!trimmedComment && !statusStore && !feelingStore) {
              alert("Nothing to save (no status, feeling, or comment)");
              return;
            }

            // Use the actual day of entry for correct status ordering.
            // ISO-week bucketing for comments still works (any day in the week maps to the same week).
            const savedAt = formatCreatedAtLocal(new Date());
            const record: Enrichment = {
              created_at: savedAt,
              "iC ID Top Account": overlayEditor.row.client_id,
              participant_team: overlayEditor.row.team,
              status: statusStore,
              feeling: feelingStore,
              comment: trimmedComment ? overlayEditor.newComment : undefined,
            };
            console.log("Saving enrichment record:", record);

            setUiEnrichment((prev) => [...prev, record]);
            setOverlayEditor(null);
          }}
        />
      ) : null}

      {modalOpen && hovered ? (
        <MeetingsModal
          hovered={{ client_id: hovered.client_id, team: hovered.team, weekKey: hovered.weekKey }}
          onClose={() => {
            setModalOpen(false);
            setHovered(null);
          }}
          comments={commentsByCellKey[cellKeyFrom(hovered.rowKey, hovered.weekKey)] ?? []}
          interactions={hovered.interactions}
          meetings={meetings}
          formatDateUTC={formatDateUTC}
        />
      ) : null}
    </div>
  );
}

// AG Grid header highlight for current week
// (inline CSS via className isn't available for header cells without theme overrides;
// this class is used by columnDefs and can be styled globally if desired.)

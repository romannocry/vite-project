import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FiEdit3 } from "react-icons/fi";

import type { Enrichment, RawMeeting } from "./DataTypes";
import { useHeatmapData } from "./useHeatmapData";
import type { InteractionCell } from "./useHeatmapData";
import { EnrichmentEditorModal, feelingToStore, statusToStore } from "./EnrichmentEditorModal";
import { MeetingsModal } from "./MeetingsModal";
import { SearchExportBar } from "./SearchExportBar";
import { SinceHeader, WeekHeader } from "./headers";
import { loadHeatmapFixtures, postEnrichment } from "./heatmapApi";
import {
  formatCreatedAtLocal,
  formatDateLocal,
  formatDateUTC,
  formatSinceDays,
  getISOWeekYear,
  parseDatetimeLocalInput,
  parseCreatedAtLocal,
} from "./utils";
import type {
  HoveredCellState,
  OverlayEditorState,
  OverlayFeeling,
  OverlayStatus,
  WeekCellValue,
} from "./heatmapUiTypes";

// Programmatic team exclusions (case-insensitive).
// Fill this list to remove teams from the grid load.
// Example: ["team1", "team4"]
const EXCLUDED_TEAMS: string[] = [];

export default function ClientTeamHeatmap() {
  const [rawMeetings, setRawMeetings] = useState<RawMeeting[] | null>(null);
  const [initialEnrichment, setInitialEnrichment] = useState<Enrichment[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadError(null);
        const { meetings, enrichment } = await loadHeatmapFixtures();
        if (cancelled) return;
        setRawMeetings(meetings);
        setInitialEnrichment(enrichment);
      } catch (e) {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : String(e));
        setRawMeetings([]);
        setInitialEnrichment([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const excludedTeams = EXCLUDED_TEAMS;
  const isExcludedTeam = (team: string) => excludedTeams.includes(team.trim().toLowerCase());

  const meetingsForGrid = useMemo(() => {
    const meetings = rawMeetings ?? [];
    if (!excludedTeams.length) return meetings;
    return meetings.filter((m) => {
      const teams = m.participant_team.split(",").map((t) => t.trim()).filter(Boolean);
      return teams.some((t) => !isExcludedTeam(t));
    });
  }, [rawMeetings]);

  const rows = useHeatmapData(meetingsForGrid, { excludedTeams });

  const [groupBy, setGroupBy] = useState<"none" | "client" | "team" | "status">("none");

  const rowKeyFrom = (r: { client_id: string; authorRegion: string; team: string }) =>
    `${r.client_id}__${r.authorRegion}__${r.team}`;

  const [uiEnrichment, setUiEnrichment] = useState<Enrichment[]>([]);
  const enrichmentState = useMemo(() => {
    // Source of truth is Data.tsx; UI additions are in-memory only.
    return [...(initialEnrichment ?? []), ...uiEnrichment];
  }, [initialEnrichment, uiEnrichment]);

  const enrichmentForGrid = useMemo(() => {
    if (!excludedTeams.length) return enrichmentState;
    return enrichmentState.filter((e) => {
      const teams = e.participant_team.split(",").map((t) => t.trim()).filter(Boolean);
      return teams.some((t) => !isExcludedTeam(t));
    });
  }, [enrichmentState]);
  const [overlayEditor, setOverlayEditor] = useState<OverlayEditorState>(null);

  const [searchText, setSearchText] = useState("");

  const cellKeyFrom = (rowKey: string, weekKey: string) => `${rowKey}||${weekKey}`;

  const gridApiRef = useRef<GridApi | null>(null);

  // Create a contiguous sequence of ISO-week keys between min and max week
  // Use meetings + enrichment dates so comment-only weeks still render as columns.
  const weekSequence = useMemo(() => {
    const normalizeToUtcDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

    const meetingDate = (created_at: string, activityDate?: string) => {
      const ad = typeof activityDate === "string" ? activityDate.trim() : "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(ad)) {
        const d = new Date(`${ad}T00:00:00`);
        if (!isNaN(d.getTime())) return d;
      }
      return parseCreatedAtLocal(created_at);
    };

    const meetingDates = meetingsForGrid.map((m) => meetingDate(m.created_at, (m as any).activityDate));
    const enrichmentDates = enrichmentForGrid.map((e) => parseCreatedAtLocal(e.created_at));

    const validDates = [...meetingDates, ...enrichmentDates]
      .filter((d) => !isNaN(d.getTime()))
      .map(normalizeToUtcDay);
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
  }, [meetingsForGrid, enrichmentForGrid]);

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

  const DEFAULT_STATUS: OverlayStatus = "Discussions ongoing";
  const OVERLAY_STATUS_VALUES = [
    "Discussions ongoing",
    "onboarding in progress",
    "live",
    "on hold",
    "abandonned",
  ] as const;

  const isOverlayStatus = (v: unknown): v is OverlayStatus =>
    typeof v === "string" && (OVERLAY_STATUS_VALUES as readonly string[]).includes(v);

  const weekKeyFromDate = (d: Date) => {
    if (isNaN(d.getTime())) return "";
    // Use the *local calendar day* (year/month/day) but evaluate in UTC to avoid timezone rollover.
    const utcDay = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const { year, week } = getISOWeekYear(utcDay);
    return `${year}-W${String(week).padStart(2, "0")}`;
  };

  const normalizedEnrichment = useMemo(() => {
    const out: Array<{
      client_id: string;
      authorRegion: string;
      team: string;
      date: Date;
      status?: Enrichment["status"];
      comment?: string;
      potential_revenue?: Enrichment["potential_revenue"];
      feeling?: Enrichment["feeling"];
    }> = [];

    for (const e of enrichmentForGrid) {
      const d = parseCreatedAtLocal(e.created_at);
      if (isNaN(d.getTime())) continue;
      const teams = e.participant_team
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .filter((t) => !isExcludedTeam(t));
      for (const team of teams) {
        const client_id = e["iC ID Top Account"];
        const authorRegion = typeof e["Author Region"] === "string" ? e["Author Region"].trim() : "";
        out.push({
          client_id,
          // Keep matching strict: if enrichment has no Author Region, it only matches rows with empty region.
          authorRegion,
          team,
          date: d,
          status: e.status,
          comment: e.comment,
          potential_revenue: e.potential_revenue,
          feeling: e.feeling,
        });
      }
    }
    return out;
  }, [enrichmentForGrid]);

  const statusByRowKey = useMemo(() => {
    const map: Record<string, { status: OverlayStatus; ts: number; idx: number }> = {};
    normalizedEnrichment.forEach((e, idx) => {
      // Only consider records that explicitly carry a status.
      // Empty-string means the default status ("Discussions ongoing").
      if (e.status === undefined) return;
      const s = typeof e.status === "string" ? e.status.trim() : "";
      const rk = rowKeyFrom({ client_id: e.client_id, authorRegion: e.authorRegion, team: e.team });
      const ts = e.date.getTime();

      const prev = map[rk];
      if (!prev || ts > prev.ts || (ts === prev.ts && idx > prev.idx)) {
        map[rk] = { status: (s ? (s as OverlayStatus) : DEFAULT_STATUS), ts, idx };
      }
    });

    return Object.fromEntries(Object.entries(map).map(([rk, v]) => [rk, v.status]));
  }, [normalizedEnrichment]);

  const resolveRowStatus = (rowKey: string, fromRow?: unknown): OverlayStatus => {
    const fromEnrichment = statusByRowKey[rowKey];
    if (fromEnrichment) return fromEnrichment;
    return isOverlayStatus(fromRow) ? fromRow : DEFAULT_STATUS;
  };

  const latestEnrichmentTsByRowKey = useMemo(() => {
    const best: Record<string, number> = {};
    normalizedEnrichment.forEach((e) => {
      const rk = rowKeyFrom({ client_id: e.client_id, authorRegion: e.authorRegion, team: e.team });
      const ts = e.date.getTime();
      if (!Number.isFinite(ts)) return;
      const prev = best[rk];
      if (prev === undefined || ts > prev) best[rk] = ts;
    });
    return best;
  }, [normalizedEnrichment]);

  const commentsByCellKey = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const e of normalizedEnrichment) {
      const c = typeof e.comment === "string" ? e.comment.trim() : "";
      if (!c) continue;
      const { year, week } = getISOWeekYear(e.date);
      const wk = `${year}-W${String(week).padStart(2, "0")}`;
      const rk = rowKeyFrom({ client_id: e.client_id, authorRegion: e.authorRegion, team: e.team });
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
      const rk = rowKeyFrom({ client_id: e.client_id, authorRegion: e.authorRegion, team: e.team });
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
      const rk = rowKeyFrom({ client_id: e.client_id, authorRegion: e.authorRegion, team: e.team });
      const ts = e.date.getTime();

      const prev = best[rk];
      if (!prev || ts > prev.ts || (ts === prev.ts && idx > prev.idx)) {
        best[rk] = { ts, idx, feeling: f as NonNullable<Enrichment["feeling"]> };
      }
    });

    return Object.fromEntries(Object.entries(best).map(([rk, v]) => [rk, v.feeling]));
  }, [normalizedEnrichment]);

  const potentialRevenueByRowKey = useMemo(() => {
    const best: Record<string, { ts: number; idx: number; val: number }> = {};

    normalizedEnrichment.forEach((e, idx) => {
      const v = e.potential_revenue;
      if (typeof v !== "number" || !Number.isFinite(v)) return;
      const rk = rowKeyFrom({ client_id: e.client_id, authorRegion: e.authorRegion, team: e.team });
      const ts = e.date.getTime();

      const prev = best[rk];
      if (!prev || ts > prev.ts || (ts === prev.ts && idx > prev.idx)) {
        best[rk] = { ts, idx, val: v };
      }
    });

    return Object.fromEntries(Object.entries(best).map(([rk, v]) => [rk, v.val]));
  }, [normalizedEnrichment]);

  // modal state (click-to-open)
  const [hovered, setHovered] = useState<HoveredCellState>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const containerStyle = { padding: 20 } as const;

  type HeatmapGridRow = {
    client_id: string;
    client_name?: string;
    authorRegion: string;
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
      const status = resolveRowStatus(key, row.status);

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

      const lastMeetingTs = dates.length ? Math.max(...dates.map((d) => d.getTime())) : NaN;
      const lastEnrichmentTs = latestEnrichmentTsByRowKey[key] ?? NaN;
      const lastUpdateTs = Math.max(
        Number.isFinite(lastMeetingTs) ? lastMeetingTs : -Infinity,
        Number.isFinite(lastEnrichmentTs) ? lastEnrichmentTs : -Infinity
      );
      const daysSince = Number.isFinite(lastUpdateTs) ? Math.floor((now.getTime() - lastUpdateTs) / 86400000) : NaN;

      return {
        client_id: row.client_id,
        client_name: row.client_name,
        authorRegion: row.authorRegion,
        team: row.team,
        status,
        firstMeeting,
        sinceLastMeeting: formatSinceDays(daysSince),
        weekMeetings,
        weekCounts,
      };
    });
  }, [rows, statusByRowKey, latestEnrichmentTsByRowKey]);

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
                rowKey: rowKeyFrom({
                  client_id: params.data.client_id,
                  authorRegion: params.data.authorRegion,
                  team: params.data.team,
                }),
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
          const hasAny = Boolean(rowHasAnyComment[key]);

          return (
            <button
              type="button"
              onClick={() => {
                const existingStatus = resolveRowStatus(key, row.status);

                setOverlayEditor({
                  row: { client_id: row.client_id, authorRegion: row.authorRegion, team: row.team },
                  status: existingStatus,
                  feeling: (feelingByRowKey[key] ?? "") as OverlayFeeling,
                  potentialRevenue:
                    potentialRevenueByRowKey[key] === undefined ? "" : String(potentialRevenueByRowKey[key]),
                  savedAtDate: formatDateLocal(new Date()),
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
      {
        headerName: "Author Region",
        field: "authorRegion",
        pinned: "left",
        width: 90,
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
          return resolveRowStatus(key, row.status);
        },
      },
      {
        headerName: "Potential revenue",
        colId: "potentialRevenue",
        pinned: "left",
        width: 150,
        valueGetter: (p) => {
          const row = p.data;
          if (!row) return "";
          const key = rowKeyFrom(row);
          const v = potentialRevenueByRowKey[key];
          return v === undefined ? "" : v;
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
          const key = rowKeyFrom(row);
          return latestCommentByRowKey[key] ?? "";
        },
        tooltipValueGetter: (p) => {
          const row = p.data;
          if (!row) return "";
          const key = rowKeyFrom(row);
          return latestCommentByRowKey[key] ?? "";
        },
        cellStyle: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
      {
        headerName: "First meeting",
        field: "firstMeeting",
        pinned: "left",
        width: 140,
        comparator: (valueA, valueB) => {
          const parseTs = (v: unknown) => {
            if (typeof v !== "string") return Number.POSITIVE_INFINITY;
            const s = v.trim();
            if (!s || s === "—") return Number.POSITIVE_INFINITY;
            const d = new Date(`${s}T00:00:00Z`);
            const t = d.getTime();
            return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
          };
          return parseTs(valueA) - parseTs(valueB);
        },
      },
      {
        headerName: "",
        headerTooltip: "Since last update (days)",
        headerComponent: SinceHeader,
        field: "sinceLastMeeting",
        pinned: "left",
        width: 88,
        comparator: (valueA, valueB) => {
          const parseDays = (v: unknown) => {
            if (typeof v === "number" && Number.isFinite(v)) return v;
            if (typeof v !== "string") return Number.POSITIVE_INFINITY;
            const m = v.match(/-?\d+/);
            if (!m) return Number.POSITIVE_INFINITY;
            const n = Number(m[0]);
            return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
          };

          return parseDays(valueA) - parseDays(valueB);
        },
      },
    ],
    [groupBy, latestCommentByRowKey, rowHasAnyComment, statusByRowKey, feelingByRowKey, potentialRevenueByRowKey]
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
          const comments = commentsByCellKey[cellKeyFrom(rowKey, wk)] ?? [];

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

  const overlaySavedWeekKey = overlayEditor
    ? (() => {
        const d = parseDatetimeLocalInput(overlayEditor.savedAtDate);
        return weekKeyFromDate(d) || curWK;
      })()
    : curWK;

  const overlayExistingComments = overlayEditor
    ? (() => {
        const rk = rowKeyFrom(overlayEditor.row);
        return commentsByCellKey[cellKeyFrom(rk, overlaySavedWeekKey)] ?? [];
      })()
    : [];

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

  if (loadError) {
    return (
      <div style={containerStyle}>
        <h2>Client × Team Interaction Heatmap</h2>
        <p style={{ color: "#b91c1c" }}>Failed to load fixtures: {loadError}</p>
      </div>
    );
  }

  if (!rawMeetings || !initialEnrichment) {
    return (
      <div style={containerStyle}>
        <h2>Client × Team Interaction Heatmap</h2>
        <p>Loading…</p>
      </div>
    );
  }

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
          getRowId={(p) =>
            rowKeyFrom({ client_id: p.data.client_id, authorRegion: p.data.authorRegion, team: p.data.team })
          }
        />
      </div>

      {overlayEditor ? (
        <EnrichmentEditorModal
          overlayEditor={overlayEditor}
          onClose={() => setOverlayEditor(null)}
          savedWeekKey={overlaySavedWeekKey}
          existingComments={overlayExistingComments}
          onChangeSavedAtDate={(v) =>
            setOverlayEditor((prev) => (prev ? { ...prev, savedAtDate: v } : prev))
          }
          onChangeStatus={(s) =>
            setOverlayEditor((prev) => (prev ? { ...prev, status: s } : prev))
          }
          onChangeFeeling={(f) =>
            setOverlayEditor((prev) => (prev ? { ...prev, feeling: f } : prev))
          }
          onChangePotentialRevenue={(v) =>
            setOverlayEditor((prev) => (prev ? { ...prev, potentialRevenue: v } : prev))
          }
          onChangeNewComment={(v) =>
            setOverlayEditor((prev) => (prev ? { ...prev, newComment: v } : prev))
          }
          onSave={() => {
            if (!overlayEditor) return;
            const trimmedComment = overlayEditor.newComment.trim();
            const statusStore = statusToStore(overlayEditor.status);
            const feelingStore = feelingToStore(overlayEditor.feeling);

            const prRaw = overlayEditor.potentialRevenue.trim();
            const prNum = prRaw ? Number(prRaw) : undefined;
            const potentialRevenueStore =
              prNum === undefined ? undefined : Number.isFinite(prNum) && prNum >= 0 ? prNum : undefined;

            if (!trimmedComment && !statusStore && !feelingStore && potentialRevenueStore === undefined) {
              alert("Nothing to save (no status, feeling, or comment)");
              return;
            }

            // Date-only selection: persist as local midnight.
            const datePart = (overlayEditor.savedAtDate ?? "").trim();
            const savedAt = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
              ? `${datePart} 00:00:00.000`
              : formatCreatedAtLocal(new Date());

            const authorRegion = overlayEditor.row.authorRegion.trim();
            const record: Enrichment = {
              created_at: savedAt,
              "iC ID Top Account": overlayEditor.row.client_id,
              "Author Region": authorRegion || undefined,
              participant_team: overlayEditor.row.team,
              status: statusStore,
              potential_revenue: potentialRevenueStore,
              feeling: feelingStore,
              comment: trimmedComment ? overlayEditor.newComment : undefined,
            };
            void postEnrichment(record).catch((err) => {
              console.error("Failed to post enrichment (dummy api)", err);
            });

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
          meetings={meetingsForGrid}
          formatDateUTC={formatDateUTC}
        />
      ) : null}
    </div>
  );
}

// AG Grid header highlight for current week
// (inline CSS via className isn't available for header cells without theme overrides;
// this class is used by columnDefs and can be styled globally if desired.)

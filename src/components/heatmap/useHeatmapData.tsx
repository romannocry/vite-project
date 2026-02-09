import { useMemo } from "react";
import type { RawMeeting } from "./Data";

export interface InteractionCell {
  client_id: number;
  team: string;
  status: RawMeeting["status"];
  meeting_id: number;
  date: Date;
  interactionIndex: number;
}

export interface HeatmapRow {
  client_id: number;
  team: string;
  status: string;
  cells: Record<number, InteractionCell>;
  maxIndex: number;
}

export function useHeatmapData(rawMeetings: RawMeeting[]): HeatmapRow[] {
  return useMemo(() => {
    if (!rawMeetings || rawMeetings.length === 0) return [];

    // 1) Explode multi-team meetings into per-team entries
    const exploded: Omit<InteractionCell, "interactionIndex">[] = rawMeetings.flatMap((m) => {
      const teams = m.participant_team.split(",").map((t) => t.trim()).filter(Boolean);
      return teams.map((team) => ({
        client_id: m.client_id,
        team,
        meeting_id: m.meeting_id,
        date: new Date(m.date),
        status: m.status,
      }));
    });

    // 2) Group by client + team
    const grouped: Record<string, InteractionCell[]> = {};
    for (const row of exploded) {
      const key = `${row.client_id}__${row.team}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ ...row, interactionIndex: 0 });
    }

    // 3) Sort within each group & assign interaction index
    for (const rows of Object.values(grouped)) {
      rows.sort((a, b) => a.date.getTime() - b.date.getTime());
      rows.forEach((row, index) => {
        row.interactionIndex = index;
      });
    }

    // 4) Build HeatmapRow objects
    return Object.values(grouped).map((rows) => {
      const { client_id, team } = rows[0];

      const lastNonEmptyStatus = [...rows]
        .reverse()
        .map((r) => (typeof r.status === "string" ? r.status.trim() : ""))
        .find((s) => s.length > 0);
      const status = lastNonEmptyStatus ?? "ongoing";

      const cells: Record<number, InteractionCell> = {};
      rows.forEach((r) => {
        cells[r.interactionIndex] = r;
      });

      return {
        client_id,
        team,
        status,
        cells,
        maxIndex: rows.length - 1,
      };
    });
  }, [rawMeetings]);
}

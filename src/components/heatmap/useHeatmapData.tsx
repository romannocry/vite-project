import { useMemo } from "react";
import type { RawMeeting } from "./Data";
import { parseCreatedAtLocal } from "./utils";

export interface InteractionCell {
  client_id: string;
  client_name?: string;
  team: string;
  status: RawMeeting["status"];
  id: string;
  date: Date;
  interactionIndex: number;
}

export interface HeatmapRow {
  client_id: string;
  client_name?: string;
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
        client_id: m["iC ID Top Account"],
        client_name: m.client_name,
        team,
        id: m.id,
        date: parseCreatedAtLocal(m.created_at),
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
      const { client_id, client_name,team } = rows[0];

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
        client_name,
        team,
        status,
        cells,
        maxIndex: rows.length - 1,
      };
    });
  }, [rawMeetings]);
}

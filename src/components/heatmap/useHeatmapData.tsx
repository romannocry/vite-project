import { useMemo } from "react";
import type { RawMeeting } from "./DataTypes";
import { parseCreatedAtLocal } from "./utils";

export interface InteractionCell {
  client_id: string;
  client_name?: string;
  authorRegion: string;
  team: string;
  bernsteinTeam?: string;
  status: RawMeeting["status"];
  id: string;
  date: Date;
  interactionIndex: number;
}

export interface HeatmapRow {
  client_id: string;
  client_name?: string;
  authorRegion: string;
  team: string;
  bernsteinTeam?: string;
  status: string;
  cells: Record<number, InteractionCell>;
  maxIndex: number;
}

export function useHeatmapData(
  rawMeetings: RawMeeting[],
  opts?: {
    excludedTeams?: string[];
  }
): HeatmapRow[] {
  return useMemo(() => {
    if (!rawMeetings || rawMeetings.length === 0) return [];

    // Guardrail: some exports/fixtures can contain duplicated meeting rows.
    // Since `id` is the meeting identifier, drop duplicates to avoid double-counting.
    const seenMeetingIds = new Set<string>();
    const meetings = rawMeetings.filter((m) => {
      const id = typeof m.id === "string" ? m.id.trim() : "";
      if (!id) return true;
      if (seenMeetingIds.has(id)) return false;
      seenMeetingIds.add(id);
      return true;
    });

    const excluded = new Set((opts?.excludedTeams ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean));
    const isExcludedTeam = (team: string) => excluded.has(team.trim().toLowerCase());

    const meetingDate = (m: RawMeeting) => {
      // Primary source: activityDate (date-only)
      const ad = typeof m.activityDate === "string" ? m.activityDate.trim() : "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(ad)) {
        const d = new Date(`${ad}T00:00:00`);
        if (!isNaN(d.getTime())) return d;
      }

      // Fallback: created_at (local datetime)
      const d2 = parseCreatedAtLocal(m.created_at);
      if (!isNaN(d2.getTime())) return d2;

      return new Date(NaN);
    };

    // 1) Explode multi-team meetings into per-team entries
    const exploded: Omit<InteractionCell, "interactionIndex">[] = meetings.flatMap((m) => {
      const authorRegion = typeof m["Author Region"] === "string" ? m["Author Region"].trim() : "";
      const bernsteinTeamRaw = typeof m.bernstein_team === "string" ? m.bernstein_team.trim() : "";
      const bernsteinTeam = bernsteinTeamRaw === "*" ? "" : bernsteinTeamRaw;
      const date = meetingDate(m);
      if (isNaN(date.getTime())) return [];
      const teamTokens = m.participant_team
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .filter((t) => !isExcludedTeam(t));

      // Some meetings may list the same team multiple times; only count it once.
      const teams: string[] = [];
      const seenTeams = new Set<string>();
      for (const t of teamTokens) {
        const k = t.toLowerCase();
        if (seenTeams.has(k)) continue;
        seenTeams.add(k);
        teams.push(t);
      }

      return teams.map((team) => ({
        client_id: m["iC ID Top Account"],
        client_name: m["Top Account"] ?? m.client_name,
        authorRegion,
        team,
        bernsteinTeam,
        id: m.id,
        date,
        status: m.status,
      }));
    });

    // 2) Group by client + author region + team
    const grouped: Record<string, InteractionCell[]> = {};
    for (const row of exploded) {
      const key = `${row.client_id}__${row.authorRegion}__${row.team}`;
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
      const { client_id, client_name, authorRegion, team } = rows[0];

      const lastNonEmptyBernsteinTeam = [...rows]
        .reverse()
        .map((r) => (typeof r.bernsteinTeam === "string" ? r.bernsteinTeam.trim() : ""))
        .find((v) => v.length > 0);
      const bernsteinTeam = lastNonEmptyBernsteinTeam ?? "";

      const lastNonEmptyStatus = [...rows]
        .reverse()
        .map((r) => (typeof r.status === "string" ? r.status.trim() : ""))
        .find((s) => s.length > 0);
      const status = lastNonEmptyStatus ?? "Discussions ongoing";

      const cells: Record<number, InteractionCell> = {};
      rows.forEach((r) => {
        cells[r.interactionIndex] = r;
      });

      return {
        client_id,
        client_name,
        authorRegion,
        team,
        bernsteinTeam,
        status,
        cells,
        maxIndex: rows.length - 1,
      };
    });
  }, [rawMeetings, opts?.excludedTeams?.join("|")]);
}

import type { Enrichment } from "./Data";
import type { InteractionCell } from "./useHeatmapData";

export type OverlayStatus = "ongoing" | "live" | "on hold" | "abandonned";

export type OverlayFeeling = "" | NonNullable<Enrichment["feeling"]>;

export type OverlayEditorState =
  | null
  | {
      row: { client_id: string; team: string };
      status: OverlayStatus;
      feeling: OverlayFeeling;
      newComment: string;
    };

export type HoveredCellState =
  | null
  | {
      client_id: string;
      client_name?: string;
      team: string;
      rowKey: string;
      weekKey: string;
      interactions: InteractionCell[];
    };

export type WeekCellValue = {
  count: number;
  comments: string[];
};

export type EnrichmentRecord = Enrichment;

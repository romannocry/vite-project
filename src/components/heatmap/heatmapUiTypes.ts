import type { Enrichment } from "./Data";
import type { InteractionCell } from "./useHeatmapData";

export type OverlayStatus = "ongoing" | "live" | "on hold" | "abandonned";

export type OverlayEditorState =
  | null
  | {
      row: { client_id: number; team: string };
      status: OverlayStatus;
      newComment: string;
    };

export type HoveredCellState =
  | null
  | {
      client_id: number;
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

import type { InteractionCell } from "./useHeatmapData";
import type { RawMeeting } from "./DataTypes";
import { Modal } from "./Modal";

export function MeetingsModal({
  hovered,
  onClose,
  comments,
  enrichmentEvents,
  interactions,
  meetings,
  formatDateUTC,
}: {
  hovered: { client_id: string; client_name?: string; authorRegion?: string; team: string; weekKey: string };
  onClose: () => void;
  comments: string[];
  enrichmentEvents: Array<{ created_at: string; fields: string[]; values: Record<string, string> }>;
  interactions: InteractionCell[];
  meetings: RawMeeting[];
  formatDateUTC: (d: Date) => string;
}) {
  const fieldLabel = (k: string) => {
    switch (k) {
      case "status":
        return "Status";
      case "feeling":
        return "Feeling";
      case "potential_revenue":
        return "Potential revenue";
      case "comment":
        return "Comment";
      default:
        return k.replace(/_/g, " ");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginTop: 0 }}>Meetings</h3>
      <p>
        Client <strong>{(hovered.client_name ?? "").trim() || hovered.client_id}</strong>
        {(hovered.client_name ?? "").trim() && (hovered.client_name ?? "").trim() !== hovered.client_id ? (
          <>
            {" "}
            <span style={{ color: "#666" }}>(ID: {hovered.client_id})</span>
          </>
        ) : null}
        {hovered.authorRegion ? (
          <>
            {" "}
            — Author Region <strong>{hovered.authorRegion}</strong>
          </>
        ) : null}
        {" "}
        — Team <strong>{hovered.team}</strong> — <em>{hovered.weekKey}</em>
      </p>

      {enrichmentEvents.length ? (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#444", marginBottom: 6 }}>What changed (enrichment)</div>
          <div style={{ display: "grid", gap: 6 }}>
            {enrichmentEvents.map((ev, i) => (
              <div
                key={`${ev.created_at}-${i}`}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #c4b5fd",
                  background: "#f5f3ff",
                }}
              >
                <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>Saved: {ev.created_at}</div>
                <div style={{ display: "grid", gap: 4 }}>
                  {ev.fields.map((k) => (
                    <div key={k} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                      <div
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: "1px solid #ddd",
                          background: "#fff",
                          color: "#111",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fieldLabel(k)}
                      </div>
                      <div style={{ fontSize: 12, color: "#111", whiteSpace: "pre-wrap" }}>
                        {ev.values?.[k] ?? ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {comments.length ? (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#444", marginBottom: 6 }}>Comments</div>
          <div style={{ display: "grid", gap: 6 }}>
            {comments.map((c, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fafafa",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Comment #{i + 1}</div>
                <div style={{ fontSize: 13, color: "#111" }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <ul>
        {interactions.map((c) => {
          const raw = meetings.find((m) => m.id === c.id);
          return (
            <li key={c.id}>{`${formatDateUTC(c.date)} — #${c.id} — ${raw?.participant_team ?? ""}`}</li>
          );
        })}
      </ul>
    </Modal>
  );
}

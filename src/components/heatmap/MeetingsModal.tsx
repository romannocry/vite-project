import type { InteractionCell } from "./useHeatmapData";
import type { RawMeeting } from "./Data";
import { Modal } from "./Modal";

export function MeetingsModal({
  hovered,
  onClose,
  comments,
  interactions,
  meetings,
  formatDateUTC,
}: {
  hovered: { client_id: number; team: string; weekKey: string };
  onClose: () => void;
  comments: string[];
  interactions: InteractionCell[];
  meetings: RawMeeting[];
  formatDateUTC: (d: Date) => string;
}) {
  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginTop: 0 }}>Meetings</h3>
      <p>
        Client <strong>{hovered.client_id}</strong> — Team <strong>{hovered.team}</strong> — <em>{hovered.weekKey}</em>
      </p>

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
          const raw = meetings.find((m) => m.meeting_id === c.meeting_id);
          return (
            <li key={c.meeting_id}>{`${formatDateUTC(c.date)} — #${c.meeting_id} — ${raw?.participant_team ?? ""}`}</li>
          );
        })}
      </ul>
    </Modal>
  );
}

import type { Enrichment } from "./Data";
import type { OverlayEditorState, OverlayStatus } from "./heatmapUiTypes";
import { Modal } from "./Modal";

export function EnrichmentEditorModal({
  overlayEditor,
  onClose,
  curWK,
  existingComments,
  onChangeStatus,
  onChangeNewComment,
  onSave,
}: {
  overlayEditor: Exclude<OverlayEditorState, null>;
  onClose: () => void;
  curWK: string;
  existingComments: string[];
  onChangeStatus: (s: OverlayStatus) => void;
  onChangeNewComment: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginTop: 0 }}>Update status / add week comment</h3>
      <p style={{ marginTop: 0, color: "#444" }}>
        Client <strong>{overlayEditor.row.client_id}</strong> — Team <strong>{overlayEditor.row.team}</strong>
      </p>

      <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        Saved on week: <strong>{curWK}</strong>
      </div>

      {existingComments.length ? (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: "#444", marginBottom: 6 }}>Existing comments (this week)</div>
          <div style={{ display: "grid", gap: 6 }}>
            {existingComments.map((c, i) => (
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
          <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
            Comments are immutable (you can only add new ones).
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#444" }}>Status</span>
          <select
            value={overlayEditor.status}
            onChange={(e) => onChangeStatus(e.target.value as OverlayStatus)}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}
          >
            <option value="ongoing">ongoing</option>
            <option value="live">live</option>
            <option value="on hold">on hold</option>
            <option value="abandonned">abandonned</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#444" }}>Week comment</span>
          <textarea
            value={overlayEditor.newComment}
            onChange={(e) => onChangeNewComment(e.target.value)}
            rows={4}
            placeholder="Add a note for this week cell…"
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", resize: "vertical" }}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function statusToStore(status: OverlayStatus): Enrichment["status"] {
  return status === "ongoing" ? "" : (status as Enrichment["status"]);
}

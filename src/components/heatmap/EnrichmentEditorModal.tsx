import type { Enrichment } from "./DataTypes";
import type { OverlayEditorState, OverlayFeeling, OverlayStatus } from "./heatmapUiTypes";
import { Modal } from "./Modal";

export function EnrichmentEditorModal({
  overlayEditor,
  onClose,
  savedWeekKey,
  existingComments,
  onChangeSavedAtDate,
  onChangeStatus,
  onChangeFeeling,
  onChangePotentialRevenue,
  onChangeNewComment,
  onSave,
}: {
  overlayEditor: Exclude<OverlayEditorState, null>;
  onClose: () => void;
  savedWeekKey: string;
  existingComments: string[];
  onChangeSavedAtDate: (v: string) => void;
  onChangeStatus: (s: OverlayStatus) => void;
  onChangeFeeling: (f: OverlayFeeling) => void;
  onChangePotentialRevenue: (v: string) => void;
  onChangeNewComment: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginTop: 0 }}>Update status / add week comment</h3>
      <p style={{ marginTop: 0, color: "#444" }}>
        Client <strong>{(overlayEditor.client_name ?? "").trim() || overlayEditor.row.client_id}</strong>
        {(overlayEditor.client_name ?? "").trim() && (overlayEditor.client_name ?? "").trim() !== overlayEditor.row.client_id ? (
          <>
            {" "}
            <span style={{ color: "#666" }}>(ID: {overlayEditor.row.client_id})</span>
          </>
        ) : null}
        {overlayEditor.row.authorRegion ? (
          <>
            {" "}
            — Author Region <strong>{overlayEditor.row.authorRegion}</strong>
          </>
        ) : null}
        {" "}
        — Team <strong>{overlayEditor.row.team}</strong>
      </p>

      <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: "#444" }}>Saved on</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="date"
            value={overlayEditor.savedAtDate}
            onChange={(e) => onChangeSavedAtDate(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}
          />
          <div style={{ fontSize: 12, color: "#666" }}>
            Week: <strong>{savedWeekKey}</strong>
          </div>
        </div>
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
            <option value="Discussions ongoing">Discussions ongoing</option>
            <option value="onboarding in progress">onboarding in progress</option>
            <option value="live">live</option>
            <option value="on hold">on hold</option>
            <option value="abandonned">abandonned</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#444" }}>Potential revenue</span>
          <input
            type="number"
            value={overlayEditor.potentialRevenue}
            onChange={(e) => onChangePotentialRevenue(e.target.value)}
            placeholder="e.g. 250000"
            step="any"
            min={0}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#444" }}>Feeling</span>
          <select
            value={overlayEditor.feeling}
            onChange={(e) => onChangeFeeling(e.target.value as OverlayFeeling)}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}
          >
            <option value="">—</option>
            <option value="positive">positive</option>
            <option value="neutral">neutral</option>
            <option value="negative">negative</option>
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
  return status === "Discussions ongoing" ? "" : (status as Enrichment["status"]);
}

export function feelingToStore(feeling: OverlayFeeling): Enrichment["feeling"] {
  return feeling ? (feeling as Enrichment["feeling"]) : undefined;
}

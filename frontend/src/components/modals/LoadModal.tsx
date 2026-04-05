import { useState, useEffect } from "react";
import { listTransformations, getTransformation } from "../../api/client";
import { useTransformerStore } from "../../store/transformerStore";
import "./Modal.css";

export function LoadModal() {
  const { closeModal, loadTransformation } = useTransformerStore();
  const [names, setNames] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTransformations()
      .then((r) => {
        setNames(r.names);
        if (r.names.length > 0) setSelected(r.names[0]);
      })
      .catch(() => setError("Could not load transformation list"))
      .finally(() => setFetching(false));
  }, []);

  const handleLoad = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const def = await getTransformation(selected);
      loadTransformation(def);
      closeModal();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Load Transformation</div>
        <div className="modal-body">
          {fetching ? (
            <p style={{ color: "#6c7086" }}>Loading saved transformations...</p>
          ) : names.length === 0 ? (
            <p style={{ color: "#6c7086" }}>No saved transformations found.</p>
          ) : (
            <div>
              <label className="form-label">Select a transformation</label>
              <select
                className="form-select"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {names.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <p style={{ fontSize: 12, color: "#6c7086" }}>
            The output structure and mappings will be restored. Import a JSON file separately to view the input fields.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleLoad}
            disabled={!selected || loading || fetching || names.length === 0}
          >
            {loading ? "Loading..." : "Load"}
          </button>
        </div>
      </div>
    </div>
  );
}

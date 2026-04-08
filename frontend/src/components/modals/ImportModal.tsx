import { useState, useRef } from "react";
import { importSchema } from "../../api/client";
import { useTransformerStore } from "../../store/transformerStore";
import "./Modal.css";

export function ImportModal() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { closeModal, setInputSchema } = useTransformerStore();

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await importSchema(file);
      setInputSchema(res.schema_, res.arrays_excluded, res.excluded_paths);
      closeModal();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Import JSON Schema</div>
        <div className="modal-body">
          <div>
            <label className="form-label">Select a JSON file</label>
            <input
              ref={inputRef}
              type="file"
              accept=".json,application/json"
              className="form-input"
              data-testid="file-input"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setError(null);
              }}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal} data-testid="cancel-import-btn">
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!file || loading}
            data-testid="confirm-import-btn"
          >
            {loading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}

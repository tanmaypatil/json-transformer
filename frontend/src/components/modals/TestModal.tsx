import { useState, useEffect } from "react";
import { listTransformations, getTransformation, executeTransformation } from "../../api/client";
import { useTransformerStore } from "../../store/transformerStore";
import "./Modal.css";

export function TestModal() {
  const { closeModal, openModal, setTestResult } = useTransformerStore();
  const [file, setFile] = useState<File | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTransformations().then((r) => {
      setNames(r.names);
      if (r.names.length > 0) setSelectedName(r.names[0]);
    }).catch(() => {});
  }, []);

  const handleRun = async () => {
    if (!file || !selectedName) return;
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const inputData = JSON.parse(text);
      const transformation = await getTransformation(selectedName);
      const result = await executeTransformation(inputData, transformation);
      setTestResult(result.output, result.warnings);
      closeModal();
      openModal("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Test failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Test Transformation</div>
        <div className="modal-body">
          <div>
            <label className="form-label">Select a saved transformation</label>
            <select
              className="form-select"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            >
              {names.length === 0 && <option value="">No saved transformations</option>}
              {names.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Import test JSON data</label>
            <input
              type="file"
              accept=".json,application/json"
              className="form-input"
              onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(null); }}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleRun}
            disabled={!file || !selectedName || loading}
          >
            {loading ? "Running..." : "Run Test"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { saveTransformation } from "../../api/client";
import { useTransformerStore } from "../../store/transformerStore";
import "./Modal.css";

const NAME_RE = /^[a-zA-Z0-9_-]+$/;

export function SaveModal() {
  const { inputSchema, outputStructure, mappings, transformationName, closeModal, setTransformationName } =
    useTransformerStore();

  const [name, setName] = useState(transformationName ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!outputStructure) return;
    const trimmed = name.trim();
    if (!trimmed) { setError("Name is required"); return; }
    if (!NAME_RE.test(trimmed)) {
      setError("Name may only contain letters, numbers, hyphens, and underscores");
      return;
    }
    setLoading(true);
    setError(null);
    const def = {
      name: trimmed,
      version: "1.0",
      created_at: new Date().toISOString(),
      input_schema: inputSchema ?? undefined,
      output_structure: outputStructure,
      mappings,
    };
    try {
      await saveTransformation(def, !!transformationName && transformationName === trimmed);
      setTransformationName(trimmed);
      setSaved(true);
      setTimeout(() => closeModal(), 800);
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes("already exists")) {
        // Retry as overwrite
        try {
          await saveTransformation(def, true);
          setTransformationName(trimmed);
          setSaved(true);
          setTimeout(() => closeModal(), 800);
        } catch (e2: unknown) {
          setError(e2 instanceof Error ? e2.message : "Save failed");
        }
      } else {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Save Transformation</div>
        <div className="modal-body">
          <div>
            <label className="form-label">Transformation name</label>
            <input
              className="form-input"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              placeholder="my-transformation"
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {saved && (
            <div style={{ color: "#a6e3a1", fontSize: 13 }}>Saved successfully!</div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading || saved}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

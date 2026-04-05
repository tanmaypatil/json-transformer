import { useTransformerStore } from "../../store/transformerStore";
import "./Toolbar.css";

export function Toolbar() {
  const { inputSchema, openModal, selectedInputPath, selectedOutputPath, clearSelection } =
    useTransformerStore();

  const hasPendingSelection = selectedInputPath !== null || selectedOutputPath !== null;

  return (
    <div className="toolbar">
      <span className="toolbar-title">JSON Transformer</span>
      <div className="toolbar-actions">
        {hasPendingSelection && (
          <span className="toolbar-hint">
            {selectedInputPath
              ? `Selected input: ${selectedInputPath} — now click an output field`
              : `Selected output: ${selectedOutputPath} — now click an input field`}
            <button className="btn btn-ghost" onClick={clearSelection}>
              Clear
            </button>
          </span>
        )}
        <button className="btn btn-primary" onClick={() => openModal("import")}>
          Import JSON
        </button>
        <button className="btn btn-secondary" onClick={() => openModal("load")}>
          Load Transformation
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => openModal("save")}
          disabled={!inputSchema}
        >
          Save Transformation
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => openModal("test")}
          disabled={!inputSchema}
        >
          Test
        </button>
      </div>
    </div>
  );
}

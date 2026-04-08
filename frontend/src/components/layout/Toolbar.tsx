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
            <button className="btn btn-ghost" onClick={clearSelection} data-testid="clear-selection-btn">
              Clear
            </button>
          </span>
        )}
        <button className="btn btn-primary" onClick={() => openModal("import")} data-testid="import-btn">
          Import JSON
        </button>
        <button className="btn btn-secondary" onClick={() => openModal("load")} data-testid="load-btn">
          Load Transformation
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => openModal("save")}
          disabled={!inputSchema}
          data-testid="save-btn"
        >
          Save Transformation
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => openModal("test")}
          disabled={!inputSchema}
          data-testid="test-btn"
        >
          Test
        </button>
      </div>
    </div>
  );
}

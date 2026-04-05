import { useTransformerStore } from "../../store/transformerStore";
import "./Modal.css";

export function ResultModal() {
  const { testResult, testWarnings, closeModal } = useTransformerStore();

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Transformation Result</div>
        <div className="modal-body">
          {testWarnings.length > 0 && (
            <div className="warning-list">
              <strong>Warnings:</strong>
              <ul style={{ marginTop: 6, paddingLeft: 16 }}>
                {testWarnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
          <pre className="result-json">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
}

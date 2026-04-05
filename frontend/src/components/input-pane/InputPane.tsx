import { useTransformerStore } from "../../store/transformerStore";
import { InputTreeNode } from "./InputTreeNode";
import "./InputPane.css";

export function InputPane() {
  const { inputSchema } = useTransformerStore();

  return (
    <div className="pane">
      <div className="pane-header">
        <span className="pane-header-label">Input</span>
        <span className="pane-header-sub">immutable</span>
      </div>
      <div className="pane-body">
        {!inputSchema ? (
          <div className="pane-empty">
            <p>Import a JSON file to begin</p>
            <p className="pane-empty-sub">Use the "Import JSON" button above</p>
          </div>
        ) : (
          inputSchema.children.map((node) => (
            <InputTreeNode key={node.path} node={node} depth={0} />
          ))
        )}
      </div>
    </div>
  );
}

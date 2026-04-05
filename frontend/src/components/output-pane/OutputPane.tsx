import { useTransformerStore } from "../../store/transformerStore";
import { OutputTreeNode } from "./OutputTreeNode";

export function OutputPane() {
  const { outputStructure } = useTransformerStore();

  return (
    <div className="pane">
      <div className="pane-header">
        <span className="pane-header-label" style={{ color: "#a6e3a1" }}>Output</span>
        <span className="pane-header-sub">editable</span>
      </div>
      <div className="pane-body">
        {!outputStructure ? (
          <div className="pane-empty">
            <p>Import a JSON file to begin</p>
          </div>
        ) : (
          outputStructure.children.map((node) => (
            <OutputTreeNode key={node.id} node={node} depth={0} />
          ))
        )}
      </div>
    </div>
  );
}

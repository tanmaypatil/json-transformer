import { useState, useRef, useEffect } from "react";
import { useTransformerStore } from "../../store/transformerStore";
import { OutputTreeNode } from "./OutputTreeNode";
import "./OutputTreeNode.css";
import "../input-pane/InputPane.css";

export function OutputPane() {
  const { outputStructure, addOutputChild } = useTransformerStore();
  const [addingRoot, setAddingRoot] = useState(false);
  const [newRootName, setNewRootName] = useState("");
  const rootInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingRoot) rootInputRef.current?.focus();
  }, [addingRoot]);

  const handleConfirmRoot = () => {
    const name = newRootName.trim();
    if (name) addOutputChild("", name);
    setAddingRoot(false);
    setNewRootName("");
  };

  return (
    <div className="pane">
      <div className="pane-header">
        <span className="pane-header-label" style={{ color: "#a6e3a1" }}>Output</span>
        <span className="pane-header-sub">editable</span>
        {outputStructure && (
          <button
            className="action-btn"
            style={{ marginLeft: "auto", fontSize: 12 }}
            onClick={() => { setAddingRoot(true); setNewRootName("new_field"); }}
            title="Add a top-level field to the output"
          >
            + Add Field
          </button>
        )}
      </div>
      <div className="pane-body">
        {!outputStructure ? (
          <div className="pane-empty">
            <p>Import a JSON file to begin</p>
          </div>
        ) : (
          <>
            {addingRoot && (
              <div className="add-child-row" style={{ paddingLeft: 12, paddingTop: 8 }}>
                <input
                  ref={rootInputRef}
                  className="add-child-input"
                  value={newRootName}
                  onChange={(e) => setNewRootName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirmRoot();
                    if (e.key === "Escape") { setAddingRoot(false); setNewRootName(""); }
                  }}
                  placeholder="field name"
                />
                <button className="action-btn" onClick={handleConfirmRoot}>Add</button>
                <button className="action-btn" onClick={() => { setAddingRoot(false); setNewRootName(""); }}>
                  Cancel
                </button>
              </div>
            )}
            {outputStructure.children.map((node) => (
              <OutputTreeNode key={node.id} node={node} depth={0} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

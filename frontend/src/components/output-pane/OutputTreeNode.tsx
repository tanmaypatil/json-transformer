import { useState, useRef, useEffect } from "react";
import type { OutputNode } from "../../types";
import { useTransformerStore } from "../../store/transformerStore";
import "./OutputTreeNode.css";

interface Props {
  node: OutputNode;
  depth: number;
}

export function OutputTreeNode({ node, depth }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [label, setLabel] = useState(node.label);
  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedOutputPath,
    mappings,
    selectOutputNode,
    renameOutputNode,
    deleteOutputNode,
    addOutputChild,
  } = useTransformerStore();

  const isLeaf = node.children.length === 0;
  const isSelected = selectedOutputPath === node.path;
  const isMapped = mappings.some((m) => m.target_path === node.path);
  const isUnmappedLeaf = isLeaf && !isMapped && node.path !== "";

  useEffect(() => {
    setLabel(node.label);
  }, [node.label]);

  useEffect(() => {
    if (addingChild) addInputRef.current?.focus();
  }, [addingChild]);

  const handleLabelBlur = () => {
    const trimmed = label.trim();
    if (trimmed && trimmed !== node.label) {
      renameOutputNode(node.path, trimmed);
    } else {
      setLabel(node.label);
    }
  };

  const handleMap = () => {
    if (isLeaf) selectOutputNode(node.path);
  };

  const handleAddChild = () => {
    setAddingChild(true);
    setNewChildName("new_field");
  };

  const handleConfirmChild = () => {
    const name = newChildName.trim();
    if (name) addOutputChild(node.path);
    setAddingChild(false);
    setNewChildName("");
  };

  const stateClass = isSelected
    ? "out-node-selected"
    : isMapped
    ? "out-node-mapped"
    : isUnmappedLeaf
    ? "out-node-unmapped"
    : "";

  return (
    <div className="tree-node" style={{ paddingLeft: depth * 16 }}>
      <div className={`out-node-row ${stateClass}`}>
        {!isLeaf && (
          <button
            className="expand-btn"
            onClick={() => setExpanded((e) => !e)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "▾" : "▸"}
          </button>
        )}
        {isLeaf && <span className="node-leaf-icon">●</span>}

        <input
          ref={inputRef}
          className="node-label-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleLabelBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") inputRef.current?.blur();
            if (e.key === "Escape") {
              setLabel(node.label);
              inputRef.current?.blur();
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="node-actions">
          {isLeaf && (
            <button
              className={`action-btn ${isSelected ? "action-btn-active" : ""}`}
              onClick={handleMap}
              title="Click to map this field from an input field"
            >
              {isMapped ? "Re-map" : "Map"}
            </button>
          )}
          <button
            className="action-btn"
            onClick={handleAddChild}
            title="Add child field"
          >
            + Child
          </button>
          {node.path !== "" && (
            <button
              className="action-btn action-btn-danger"
              onClick={() => deleteOutputNode(node.path)}
              title="Delete this field"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {addingChild && (
        <div className="add-child-row" style={{ paddingLeft: (depth + 1) * 16 + 12 }}>
          <input
            ref={addInputRef}
            className="add-child-input"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmChild();
              if (e.key === "Escape") {
                setAddingChild(false);
                setNewChildName("");
              }
            }}
            placeholder="field name"
          />
          <button className="action-btn" onClick={handleConfirmChild}>
            Add
          </button>
          <button
            className="action-btn"
            onClick={() => {
              setAddingChild(false);
              setNewChildName("");
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {!isLeaf && expanded && (
        <div className="node-children">
          {node.children.map((child) => (
            <OutputTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

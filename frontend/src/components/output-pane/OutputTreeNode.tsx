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
  const [settingValue, setSettingValue] = useState(false);
  const [constantInput, setConstantInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedOutputPath,
    mappings,
    selectOutputNode,
    renameOutputNode,
    deleteOutputNode,
    addOutputChild,
    setConstantValue,
  } = useTransformerStore();

  const isLeaf = node.children.length === 0;
  const isSelected = selectedOutputPath === node.path;
  const mapping = mappings.find((m) => m.target_path === node.path);
  const isMapped = !!mapping;
  const isConstant = mapping?.constant_value !== undefined;
  const isUnmappedLeaf = isLeaf && !isMapped && node.path !== "";

  useEffect(() => { setLabel(node.label); }, [node.label]);
  useEffect(() => { if (addingChild) addInputRef.current?.focus(); }, [addingChild]);
  useEffect(() => {
    if (settingValue) {
      setConstantInput(mapping?.constant_value ?? "");
      valueInputRef.current?.focus();
    }
  }, [settingValue]);

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
    if (name) addOutputChild(node.path, name);
    setAddingChild(false);
    setNewChildName("");
  };

  const handleConfirmValue = () => {
    setConstantValue(node.path, constantInput);
    setSettingValue(false);
  };

  const stateClass = isSelected
    ? "out-node-selected"
    : isConstant
    ? "out-node-constant"
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
            if (e.key === "Escape") { setLabel(node.label); inputRef.current?.blur(); }
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {isConstant && (
          <span className="constant-badge" title="Constant value">
            = "{mapping!.constant_value}"
          </span>
        )}

        <div className="node-actions">
          {isLeaf && (
            <>
              <button
                className={`action-btn ${isSelected ? "action-btn-active" : ""}`}
                onClick={handleMap}
                title="Map from an input field"
              >
                {isMapped && !isConstant ? "Re-map" : "Map"}
              </button>
              <button
                className={`action-btn ${settingValue ? "action-btn-active" : ""}`}
                onClick={() => setSettingValue((v) => !v)}
                title="Set a constant value"
              >
                = Value
              </button>
            </>
          )}
          <button className="action-btn" onClick={handleAddChild} title="Add child field">
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

      {settingValue && (
        <div className="add-child-row" style={{ paddingLeft: (depth + 1) * 16 + 12 }}>
          <input
            ref={valueInputRef}
            className="add-child-input"
            value={constantInput}
            onChange={(e) => setConstantInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmValue();
              if (e.key === "Escape") setSettingValue(false);
            }}
            placeholder='e.g. "hybrid"'
          />
          <button className="action-btn" onClick={handleConfirmValue}>Set</button>
          <button className="action-btn" onClick={() => setSettingValue(false)}>Cancel</button>
        </div>
      )}

      {addingChild && (
        <div className="add-child-row" style={{ paddingLeft: (depth + 1) * 16 + 12 }}>
          <input
            ref={addInputRef}
            className="add-child-input"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmChild();
              if (e.key === "Escape") { setAddingChild(false); setNewChildName(""); }
            }}
            placeholder="field name"
          />
          <button className="action-btn" onClick={handleConfirmChild}>Add</button>
          <button className="action-btn" onClick={() => { setAddingChild(false); setNewChildName(""); }}>
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

import { useState } from "react";
import type { FieldNode } from "../../types";
import { useTransformerStore } from "../../store/transformerStore";
import "./InputTreeNode.css";

interface Props {
  node: FieldNode;
  depth: number;
}

export function InputTreeNode({ node, depth }: Props) {
  const [expanded, setExpanded] = useState(true);
  const { selectedInputPath, mappings, selectInputNode } = useTransformerStore();

  const isLeaf = node.children.length === 0 && node.field_type !== "object";
  const isSelected = selectedInputPath === node.path;
  const isMapped = mappings.some((m) => m.source_path === node.path);

  const handleClick = () => {
    if (isLeaf) {
      selectInputNode(node.path);
    } else {
      setExpanded((e) => !e);
    }
  };

  const stateClass = isSelected ? "node-selected" : isMapped ? "node-mapped" : "";

  return (
    <div className="tree-node" style={{ paddingLeft: depth * 16 }}>
      <div className={`node-row ${stateClass}`} onClick={handleClick}>
        {!isLeaf && (
          <span className="node-expand">{expanded ? "▾" : "▸"}</span>
        )}
        {isLeaf && <span className="node-leaf-icon">●</span>}
        <span className="node-label">{node.label}</span>
        <span className={`node-type type-${node.field_type}`}>{node.field_type}</span>
        {isMapped && <span className="node-badge mapped-badge">mapped</span>}
      </div>
      {!isLeaf && expanded && (
        <div className="node-children">
          {node.children.map((child) => (
            <InputTreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

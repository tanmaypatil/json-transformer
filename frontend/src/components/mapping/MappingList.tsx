import { useState } from "react";
import { useTransformerStore } from "../../store/transformerStore";
import { MappingRow } from "./MappingRow";
import "./MappingList.css";

export function MappingList() {
  const { mappings } = useTransformerStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mapping-list">
      <div className="mapping-list-header" onClick={() => setCollapsed((c) => !c)}>
        <span>Mappings ({mappings.length})</span>
        <span className="mapping-list-toggle">{collapsed ? "▸" : "▾"}</span>
      </div>
      {!collapsed && (
        <div className="mapping-list-body">
          {mappings.length === 0 ? (
            <p className="mapping-empty">
              No mappings yet. Click an input field, then click an output field (or its Map button) to create a mapping.
            </p>
          ) : (
            mappings.map((m) => <MappingRow key={m.id} mapping={m} />)
          )}
        </div>
      )}
    </div>
  );
}

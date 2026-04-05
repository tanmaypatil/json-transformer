import type { Mapping, TransformFunction } from "../../types";
import { useTransformerStore } from "../../store/transformerStore";
import "./MappingRow.css";

const ALL_FUNCTIONS: TransformFunction[] = ["UPPERCASE", "TRIM"];

interface Props {
  mapping: Mapping;
}

export function MappingRow({ mapping }: Props) {
  const { deleteMapping, updateMappingFunctions } = useTransformerStore();

  const addFunction = (fn: TransformFunction) => {
    if (!mapping.functions.includes(fn)) {
      updateMappingFunctions(mapping.id, [...mapping.functions, fn]);
    }
  };

  const removeFunction = (fn: TransformFunction) => {
    updateMappingFunctions(
      mapping.id,
      mapping.functions.filter((f) => f !== fn)
    );
  };

  const available = ALL_FUNCTIONS.filter((f) => !mapping.functions.includes(f));

  const isConstant = mapping.constant_value !== undefined;

  return (
    <div className="mapping-row">
      <div className="mapping-paths">
        {isConstant ? (
          <span className="mapping-constant">"{mapping.constant_value}"</span>
        ) : (
          <span className="mapping-source">{mapping.source_path}</span>
        )}
        <span className="mapping-arrow">→</span>
        <span className="mapping-target">{mapping.target_path}</span>
      </div>
      <div className="mapping-functions">
        {mapping.functions.map((fn) => (
          <span key={fn} className="fn-pill">
            {fn}
            <button
              className="fn-remove"
              onClick={() => removeFunction(fn as TransformFunction)}
              title={`Remove ${fn}`}
            >
              ✕
            </button>
          </span>
        ))}
        {available.length > 0 && (
          <select
            className="fn-select"
            value=""
            onChange={(e) => {
              if (e.target.value) addFunction(e.target.value as TransformFunction);
            }}
          >
            <option value="">+ Function</option>
            {available.map((fn) => (
              <option key={fn} value={fn}>
                {fn}
              </option>
            ))}
          </select>
        )}
      </div>
      <button
        className="mapping-delete"
        onClick={() => deleteMapping(mapping.id)}
        title="Remove mapping"
      >
        Remove
      </button>
    </div>
  );
}

import { useState } from "react";
import { useTransformerStore } from "../../store/transformerStore";
import "./ArrayNotice.css";

export function ArrayNotice() {
  const { excludedPaths } = useTransformerStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="array-notice">
      <span>
        <strong>Array fields are not supported in v1.0 and have been excluded:</strong>{" "}
        {excludedPaths.join(", ")}
      </span>
      <button className="array-notice-close" onClick={() => setDismissed(true)}>
        ✕
      </button>
    </div>
  );
}

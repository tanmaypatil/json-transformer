import { useEffect } from "react";
import { Toolbar } from "./Toolbar";
import { InputPane } from "../input-pane/InputPane";
import { OutputPane } from "../output-pane/OutputPane";
import { MappingList } from "../mapping/MappingList";
import { ImportModal } from "../modals/ImportModal";
import { LoadModal } from "../modals/LoadModal";
import { SaveModal } from "../modals/SaveModal";
import { TestModal } from "../modals/TestModal";
import { ResultModal } from "../modals/ResultModal";
import { ArrayNotice } from "../modals/ArrayNotice";
import { useTransformerStore } from "../../store/transformerStore";
import "./AppShell.css";

export function AppShell() {
  const { activeModal, arraysExcluded, clearSelection } = useTransformerStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [clearSelection]);

  return (
    <div className="app-shell">
      <Toolbar />
      {arraysExcluded && <ArrayNotice />}
      <div className="panes">
        <InputPane />
        <div className="pane-divider" />
        <OutputPane />
      </div>
      <MappingList />

      {activeModal === "import" && <ImportModal />}
      {activeModal === "load" && <LoadModal />}
      {activeModal === "save" && <SaveModal />}
      {activeModal === "test" && <TestModal />}
      {activeModal === "result" && <ResultModal />}
    </div>
  );
}

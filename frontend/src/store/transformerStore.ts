import { create } from "zustand";
import type {
  FieldNode,
  OutputNode,
  Mapping,
  TransformFunction,
  TransformationDef,
} from "../types";

function fieldNodeToOutputNode(node: FieldNode): OutputNode {
  return {
    id: Math.random().toString(36).slice(2),
    label: node.label,
    path: node.path,
    children: node.children.map(fieldNodeToOutputNode),
  };
}

function removeNodeFromTree(
  nodes: OutputNode[],
  path: string
): OutputNode[] {
  return nodes
    .filter((n) => n.path !== path)
    .map((n) => ({ ...n, children: removeNodeFromTree(n.children, path) }));
}

function addChildToTree(
  nodes: OutputNode[],
  parentPath: string,
  newNode: OutputNode
): OutputNode[] {
  return nodes.map((n) => {
    if (n.path === parentPath) {
      return { ...n, children: [...n.children, newNode] };
    }
    return { ...n, children: addChildToTree(n.children, parentPath, newNode) };
  });
}

function renameNodeInTree(
  nodes: OutputNode[],
  targetPath: string,
  newLabel: string,
  parentPath: string
): OutputNode[] {
  return nodes.map((n) => {
    if (n.path === targetPath) {
      const newPath = parentPath ? `${parentPath}.${newLabel}` : newLabel;
      return { ...n, label: newLabel, path: newPath };
    }
    return {
      ...n,
      children: renameNodeInTree(n.children, targetPath, newLabel, n.path),
    };
  });
}

interface TransformerStore {
  inputSchema: FieldNode | null;
  arraysExcluded: boolean;
  excludedPaths: string[];
  outputStructure: OutputNode | null;
  mappings: Mapping[];
  selectedInputPath: string | null;
  selectedOutputPath: string | null;
  activeModal: "import" | "load" | "save" | "test" | "result" | null;
  testResult: Record<string, unknown> | null;
  testWarnings: string[];
  isBusy: boolean;
  errorMessage: string | null;
  transformationName: string | null;

  setInputSchema: (
    schema: FieldNode,
    arraysExcluded: boolean,
    excludedPaths: string[]
  ) => void;
  selectInputNode: (path: string) => void;
  selectOutputNode: (path: string) => void;
  clearSelection: () => void;
  deleteMapping: (id: string) => void;
  updateMappingFunctions: (id: string, functions: TransformFunction[]) => void;
  addOutputChild: (parentPath: string) => void;
  renameOutputNode: (path: string, newLabel: string) => void;
  deleteOutputNode: (path: string) => void;
  setTestResult: (output: Record<string, unknown>, warnings: string[]) => void;
  openModal: (modal: TransformerStore["activeModal"]) => void;
  closeModal: () => void;
  setBusy: (busy: boolean) => void;
  setError: (msg: string | null) => void;
  setTransformationName: (name: string) => void;
  loadTransformation: (def: TransformationDef) => void;
}

export const useTransformerStore = create<TransformerStore>((set, get) => ({
  inputSchema: null,
  arraysExcluded: false,
  excludedPaths: [],
  outputStructure: null,
  mappings: [],
  selectedInputPath: null,
  selectedOutputPath: null,
  activeModal: null,
  testResult: null,
  testWarnings: [],
  isBusy: false,
  errorMessage: null,
  transformationName: null,

  setInputSchema: (schema, arraysExcluded, excludedPaths) => {
    const outputRoot: OutputNode = {
      id: "root",
      label: "root",
      path: "",
      children: schema.children.map(fieldNodeToOutputNode),
    };
    set({
      inputSchema: schema,
      arraysExcluded,
      excludedPaths,
      outputStructure: outputRoot,
      mappings: [],
      selectedInputPath: null,
      selectedOutputPath: null,
    });
  },

  selectInputNode: (path) => {
    const current = get().selectedInputPath;
    if (current === path) {
      set({ selectedInputPath: null });
      return;
    }
    set({ selectedInputPath: path });
    // If output is already selected, create the mapping
    const outPath = get().selectedOutputPath;
    if (outPath) {
      const mapping: Mapping = {
        id: Math.random().toString(36).slice(2),
        source_path: path,
        target_path: outPath,
        functions: [],
      };
      set((s) => ({
        mappings: [...s.mappings.filter((m) => m.target_path !== outPath), mapping],
        selectedInputPath: null,
        selectedOutputPath: null,
      }));
    }
  },

  selectOutputNode: (path) => {
    const current = get().selectedOutputPath;
    if (current === path) {
      set({ selectedOutputPath: null });
      return;
    }
    set({ selectedOutputPath: path });
    // If input is already selected, create the mapping
    const inPath = get().selectedInputPath;
    if (inPath) {
      const mapping: Mapping = {
        id: Math.random().toString(36).slice(2),
        source_path: inPath,
        target_path: path,
        functions: [],
      };
      set((s) => ({
        mappings: [...s.mappings.filter((m) => m.target_path !== path), mapping],
        selectedInputPath: null,
        selectedOutputPath: null,
      }));
    }
  },

  clearSelection: () => set({ selectedInputPath: null, selectedOutputPath: null }),

  deleteMapping: (id) =>
    set((s) => ({ mappings: s.mappings.filter((m) => m.id !== id) })),

  updateMappingFunctions: (id, functions) =>
    set((s) => ({
      mappings: s.mappings.map((m) => (m.id === id ? { ...m, functions } : m)),
    })),

  addOutputChild: (parentPath) => {
    const newNode: OutputNode = {
      id: Math.random().toString(36).slice(2),
      label: "new_field",
      path: parentPath ? `${parentPath}.new_field` : "new_field",
      children: [],
    };
    set((s) => {
      if (!s.outputStructure) return {};
      const updatedChildren = addChildToTree(
        s.outputStructure.children,
        parentPath,
        newNode
      );
      return {
        outputStructure: { ...s.outputStructure, children: updatedChildren },
      };
    });
  },

  renameOutputNode: (path, newLabel) => {
    set((s) => {
      if (!s.outputStructure) return {};
      const updatedChildren = renameNodeInTree(
        s.outputStructure.children,
        path,
        newLabel,
        ""
      );
      return {
        outputStructure: { ...s.outputStructure, children: updatedChildren },
      };
    });
  },

  deleteOutputNode: (path) => {
    set((s) => {
      if (!s.outputStructure) return {};
      return {
        outputStructure: {
          ...s.outputStructure,
          children: removeNodeFromTree(s.outputStructure.children, path),
        },
        mappings: s.mappings.filter(
          (m) => m.target_path !== path && !m.target_path.startsWith(`${path}.`)
        ),
      };
    });
  },

  setTestResult: (output, warnings) =>
    set({ testResult: output, testWarnings: warnings }),

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setBusy: (busy) => set({ isBusy: busy }),
  setError: (msg) => set({ errorMessage: msg }),
  setTransformationName: (name) => set({ transformationName: name }),

  loadTransformation: (def) =>
    set({
      outputStructure: def.output_structure,
      mappings: def.mappings,
      transformationName: def.name,
      selectedInputPath: null,
      selectedOutputPath: null,
    }),
}));

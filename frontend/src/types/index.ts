export interface FieldNode {
  label: string;
  path: string;
  field_type: "string" | "number" | "boolean" | "object" | "null";
  children: FieldNode[];
}

export interface OutputNode {
  id: string;
  label: string;
  path: string;
  children: OutputNode[];
}

export interface Mapping {
  id: string;
  source_path: string;
  target_path: string;
  functions: TransformFunction[];
}

export type TransformFunction = "UPPERCASE" | "TRIM";

export interface TransformationDef {
  name: string;
  version: string;
  created_at: string;
  output_structure: OutputNode;
  mappings: Mapping[];
}

export interface ImportResponse {
  schema_: FieldNode;
  arrays_excluded: boolean;
  excluded_paths: string[];
}

export interface ExecuteResponse {
  output: Record<string, unknown>;
  warnings: string[];
}

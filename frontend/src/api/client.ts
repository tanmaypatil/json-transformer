import type {
  ImportResponse,
  TransformationDef,
  ExecuteResponse,
} from "../types";

const BASE = "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail?.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function importSchema(file: File): Promise<ImportResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/schema/import`, { method: "POST", body: form });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail?.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export function listTransformations(): Promise<{ names: string[] }> {
  return request("/transformations");
}

export function getTransformation(name: string): Promise<TransformationDef> {
  return request(`/transformations/${name}`);
}

export function saveTransformation(
  def: TransformationDef,
  overwrite: boolean
): Promise<{ saved: boolean; name: string }> {
  if (overwrite) {
    return request(`/transformations/${def.name}`, {
      method: "PUT",
      body: JSON.stringify(def),
    });
  }
  return request("/transformations", {
    method: "POST",
    body: JSON.stringify(def),
  });
}

export function executeTransformation(
  inputData: Record<string, unknown>,
  transformation: TransformationDef
): Promise<ExecuteResponse> {
  return request("/execute", {
    method: "POST",
    body: JSON.stringify({ input_data: inputData, transformation }),
  });
}

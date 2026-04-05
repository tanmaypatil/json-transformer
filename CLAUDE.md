# JSON Transformer

## Objective
A visual tool to map fields from an input JSON structure to a custom output structure. The UI must be simple enough to be operated by Claude computer use — large click targets, clear labels, no hover-only interactions.

## Application Layout
Two-pane view:
- **Left pane (Input)** — immutable tree of the imported JSON structure
- **Right pane (Output)** — editable tree the user shapes and maps into

## Core Features

### Import
User imports a JSON file. Its structure becomes the input schema. Values are ignored — only the field names and types matter. Array fields are skipped (see v1.0 constraints).

### Mapping
- User clicks an input leaf field, then clicks an output leaf field (or its **Map** button) — a mapping is created.
- Mapped nodes show a green border; unmapped output leaves show an orange border.
- A transformation function can be applied to a mapping: **UPPERCASE**, **TRIM**. Functions are applied in order.

### Constant Values
Any output leaf node can be assigned a hardcoded constant value instead of a mapped input field. Example: `address_type = "hybrid"`. Constant nodes show a purple border.

### Output Structure Editing
- Output mirrors the input structure on import, but can be freely modified.
- Nodes can be renamed (inline input, always visible).
- Child nodes can be added to any node, including the root (via **+ Add Field** in the output pane header).
- Nodes can be deleted. Deleting a node also removes its mappings.
- Unmapped output leaves are excluded from the final output.

### Save
User saves the transformation under a name (letters, numbers, hyphens, underscores only). Saved as a JSON file on the filesystem. Includes the input schema, output structure, and all mappings.

### Load
User loads a previously saved transformation by name. Both the input schema and output structure are restored, ready to review or edit further.

### Test
User selects a saved transformation and imports a test JSON file. The transformation is executed and the resulting output JSON is displayed.

## Node Visual States
| Border colour | Meaning |
|---|---|
| Green | Mapped to an input field |
| Purple | Has a constant value |
| Orange | Output leaf with no mapping (will be excluded) |
| Yellow background | Currently selected (pending two-click map) |

## Two-Click Mapping Flow
1. Click an input leaf — it highlights yellow. A status bar shows: *"Selected: field.path — now click an output field"*.
2. Click an output leaf (or its **Map** button) — mapping is created immediately, both nodes turn green.
3. Press **Escape** or click **Clear** to cancel a pending selection.

## v1.0 Constraints
- **No array support.** Array fields in the imported JSON are skipped. A dismissible notice lists the excluded paths.
- No drag-and-drop. All interactions are click-based.

## Tech Stack
- **Frontend:** React + TypeScript (Vite), Zustand for state
- **Backend:** Python, FastAPI
- **Storage:** Transformation files saved as JSON on the local filesystem

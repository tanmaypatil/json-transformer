from typing import Any
from backend.models.transformation import TransformationDef, OutputNode
from backend.services.functions import apply_functions


def resolve_path(data: dict, dotpath: str) -> tuple[Any, bool]:
    """Resolve a dot-notation path in a nested dict. Returns (value, found)."""
    if not dotpath:
        return data, True
    parts = dotpath.split(".")
    current = data
    for part in parts:
        if not isinstance(current, dict) or part not in current:
            return None, False
        current = current[part]
    return current, True


def set_path(data: dict, dotpath: str, value: Any) -> None:
    """Set a value at a dot-notation path, creating intermediate dicts as needed."""
    parts = dotpath.split(".")
    current = data
    for part in parts[:-1]:
        if part not in current or not isinstance(current[part], dict):
            current[part] = {}
        current = current[part]
    current[parts[-1]] = value


def _init_output_structure(node: OutputNode, output: dict) -> None:
    """Pre-populate all leaf paths in the output with None."""
    if not node.children:
        if node.path:
            set_path(output, node.path, None)
    else:
        for child in node.children:
            _init_output_structure(child, output)


def execute_transformation(
    input_data: dict, transformation: TransformationDef
) -> tuple[dict, list[str]]:
    output: dict = {}
    warnings: list[str] = []

    _init_output_structure(transformation.output_structure, output)

    for mapping in transformation.mappings:
        if mapping.constant_value is not None:
            value = mapping.constant_value
        else:
            value, found = resolve_path(input_data, mapping.source_path)
            if not found:
                warnings.append(f"Source path '{mapping.source_path}' not found in input — set to null")
                value = None

        if value is not None and mapping.functions:
            value = apply_functions(value, mapping.functions)

        set_path(output, mapping.target_path, value)

    return output, warnings

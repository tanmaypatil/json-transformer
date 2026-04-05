from typing import Any
from backend.models.schema import FieldNode


def _get_type(value: Any) -> str:
    if isinstance(value, bool):
        return "boolean"
    if isinstance(value, int) or isinstance(value, float):
        return "number"
    if isinstance(value, str):
        return "string"
    if isinstance(value, dict):
        return "object"
    return "null"


def _parse_node(key: str, value: Any, parent_path: str, excluded_paths: list[str]) -> FieldNode | None:
    path = f"{parent_path}.{key}" if parent_path else key

    if isinstance(value, list):
        excluded_paths.append(path)
        return None

    field_type = _get_type(value)
    children = []

    if isinstance(value, dict):
        for child_key, child_value in value.items():
            child_node = _parse_node(child_key, child_value, path, excluded_paths)
            if child_node is not None:
                children.append(child_node)

    return FieldNode(label=key, path=path, field_type=field_type, children=children)


def parse_json_to_field_nodes(data: dict) -> tuple[FieldNode, list[str]]:
    excluded_paths: list[str] = []
    children = []

    for key, value in data.items():
        node = _parse_node(key, value, "", excluded_paths)
        if node is not None:
            children.append(node)

    root = FieldNode(label="root", path="", field_type="object", children=children)
    return root, excluded_paths

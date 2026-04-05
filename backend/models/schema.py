from __future__ import annotations
from pydantic import BaseModel
from typing import List


class FieldNode(BaseModel):
    label: str
    path: str
    field_type: str  # "string" | "number" | "boolean" | "object" | "null"
    children: List[FieldNode] = []

    model_config = {"arbitrary_types_allowed": True}


FieldNode.model_rebuild()

from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid
from backend.models.schema import FieldNode


class OutputNode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: str
    path: str
    children: List[OutputNode] = []

    model_config = {"arbitrary_types_allowed": True}


class Mapping(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source_path: str = ""
    target_path: str
    functions: List[str] = []
    constant_value: Optional[str] = None


class TransformationDef(BaseModel):
    name: str
    version: str = "1.0"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    input_schema: Optional[FieldNode] = None
    output_structure: OutputNode
    mappings: List[Mapping] = []


OutputNode.model_rebuild()

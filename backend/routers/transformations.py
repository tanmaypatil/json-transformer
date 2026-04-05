import json
import re
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.models.transformation import TransformationDef

router = APIRouter(prefix="/transformations", tags=["transformations"])

STORAGE_DIR = Path(__file__).parent.parent / "storage" / "transformations"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

NAME_PATTERN = re.compile(r"^[a-zA-Z0-9_\-]+$")


def _validate_name(name: str) -> None:
    if not NAME_PATTERN.match(name):
        raise HTTPException(
            status_code=422,
            detail="Transformation name may only contain letters, numbers, hyphens, and underscores"
        )


def _path_for(name: str) -> Path:
    return STORAGE_DIR / f"{name}.json"


class NamesResponse(BaseModel):
    names: list[str]


class SaveResponse(BaseModel):
    saved: bool
    name: str


class DeleteResponse(BaseModel):
    deleted: bool


@router.get("", response_model=NamesResponse)
def list_transformations():
    names = [f.stem for f in STORAGE_DIR.glob("*.json")]
    return NamesResponse(names=sorted(names))


@router.get("/{name}", response_model=TransformationDef)
def get_transformation(name: str):
    _validate_name(name)
    p = _path_for(name)
    if not p.exists():
        raise HTTPException(status_code=404, detail=f"Transformation '{name}' not found")
    return TransformationDef.model_validate_json(p.read_text())


@router.post("", response_model=SaveResponse, status_code=201)
def create_transformation(transformation: TransformationDef):
    _validate_name(transformation.name)
    p = _path_for(transformation.name)
    if p.exists():
        raise HTTPException(status_code=409, detail=f"Transformation '{transformation.name}' already exists. Use PUT to overwrite.")
    p.write_text(transformation.model_dump_json(indent=2))
    return SaveResponse(saved=True, name=transformation.name)


@router.put("/{name}", response_model=SaveResponse)
def update_transformation(name: str, transformation: TransformationDef):
    _validate_name(name)
    p = _path_for(name)
    transformation.name = name
    p.write_text(transformation.model_dump_json(indent=2))
    return SaveResponse(saved=True, name=name)


@router.delete("/{name}", response_model=DeleteResponse)
def delete_transformation(name: str):
    _validate_name(name)
    p = _path_for(name)
    if not p.exists():
        raise HTTPException(status_code=404, detail=f"Transformation '{name}' not found")
    p.unlink()
    return DeleteResponse(deleted=True)

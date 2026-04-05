import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.schema_parser import parse_json_to_field_nodes
from backend.models.schema import FieldNode
from pydantic import BaseModel

router = APIRouter(prefix="/schema", tags=["schema"])


class ImportResponse(BaseModel):
    schema_: FieldNode
    arrays_excluded: bool
    excluded_paths: list[str]

    model_config = {"populate_by_name": True}


@router.post("/import", response_model=ImportResponse)
async def import_schema(file: UploadFile = File(...)):
    content = await file.read()
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Invalid JSON file")

    if not isinstance(data, dict):
        raise HTTPException(status_code=422, detail="JSON root must be an object, not an array or scalar")

    root, excluded_paths = parse_json_to_field_nodes(data)
    return ImportResponse(
        schema_=root,
        arrays_excluded=len(excluded_paths) > 0,
        excluded_paths=excluded_paths,
    )

from fastapi import APIRouter
from pydantic import BaseModel
from backend.models.transformation import TransformationDef
from backend.services.executor import execute_transformation

router = APIRouter(prefix="/execute", tags=["execute"])


class ExecuteRequest(BaseModel):
    input_data: dict
    transformation: TransformationDef


class ExecuteResponse(BaseModel):
    output: dict
    warnings: list[str]


@router.post("", response_model=ExecuteResponse)
def execute(request: ExecuteRequest):
    output, warnings = execute_transformation(request.input_data, request.transformation)
    return ExecuteResponse(output=output, warnings=warnings)

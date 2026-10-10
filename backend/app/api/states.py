from fastapi import APIRouter
from typing import List
from app.schemas.schemes import StateResponse

router = APIRouter()

@router.get("/", response_model=List[StateResponse])
def get_states():
    # Development Stub
    return [
        StateResponse(id="TN", name="Tamil Nadu"),
        StateResponse(id="KA", name="Karnataka"),
        StateResponse(id="MH", name="Maharashtra"),
    ]

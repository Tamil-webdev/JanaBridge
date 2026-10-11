from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.schemas.schemes import SchemeListResponse, SchemeResponse

router = APIRouter()

# Dummy data
DUMMY_SCHEMES = [
    SchemeResponse(
        id="dev-scheme-1",
        title="[DEV STUB] Demo Scholarship",
        description="This is a development stub. Unverified data.",
        state="TN",
        government_scope="state"
    )
]

@router.get("/", response_model=SchemeListResponse)
def list_schemes(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    items = DUMMY_SCHEMES[skip:skip+limit]
    return SchemeListResponse(items=items, total=len(DUMMY_SCHEMES), page=skip//limit+1 if limit > 0 else 1, size=len(items))

@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme(scheme_id: str):
    for s in DUMMY_SCHEMES:
        if s.id == scheme_id:
            return s
    raise HTTPException(status_code=404, detail="Scheme not found")

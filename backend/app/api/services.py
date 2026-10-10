from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.schemas.schemes import ServiceListResponse, ServiceResponse

router = APIRouter()

DUMMY_SERVICES = [
    ServiceResponse(id="dev-service-1", name="[DEV STUB] Certificate Service", description="Unverified development service")
]

@router.get("/", response_model=ServiceListResponse)
def list_services(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    items = DUMMY_SERVICES[skip:skip+limit]
    return ServiceListResponse(items=items, total=len(DUMMY_SERVICES), page=skip//limit+1 if limit > 0 else 1, size=len(items))

@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(service_id: str):
    for s in DUMMY_SERVICES:
        if s.id == service_id:
            return s
    raise HTTPException(status_code=404, detail="Service not found")

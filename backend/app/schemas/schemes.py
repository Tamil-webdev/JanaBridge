from pydantic import BaseModel
from typing import List, Optional

class SchemeBase(BaseModel):
    title: str
    description: str
    state: str
    government_scope: str

class SchemeResponse(SchemeBase):
    id: str

class SchemeListResponse(BaseModel):
    items: List[SchemeResponse]
    total: int
    page: int
    size: int

class ServiceResponse(BaseModel):
    id: str
    name: str
    description: str

class ServiceListResponse(BaseModel):
    items: List[ServiceResponse]
    total: int
    page: int
    size: int

class StateResponse(BaseModel):
    id: str
    name: str

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class DocumentBase(BaseModel):
    pass

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    status: str
    size_bytes: int

class DocumentResponse(BaseModel):
    document_id: str
    filename: str
    status: str
    size_bytes: int
    page_count: int
    uploaded_at: datetime
    error_message: Optional[str] = None
    source_type: str

class DocumentListResponse(BaseModel):
    items: List[DocumentResponse]
    total: int
    page: int
    size: int

class DocumentProcessResponse(BaseModel):
    document_id: str
    status: str
    page_count: int
    pages_with_text: int
    pages_without_text: List[int]

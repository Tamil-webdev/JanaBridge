from pydantic import BaseModel, Field
from typing import List, Optional

class ChatCitation(BaseModel):
    citation_id: str
    document_id: str
    source_title: str
    page: int
    snippet: str

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    state: Optional[str] = None
    government_scope: Optional[str] = None
    selected_document_ids: Optional[List[str]] = None

class ChatResponse(BaseModel):
    status: str
    answer: str
    citations: List[ChatCitation] = Field(default_factory=list)
    needs_clarification: bool = False
    limitations: List[str] = Field(default_factory=list)

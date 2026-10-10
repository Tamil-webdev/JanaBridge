from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.schemas.chat import ChatCitation

class MessageBase(BaseModel):
    role: str
    content: str
    citations: Optional[List[ChatCitation]] = Field(default_factory=list)

class MessageResponse(MessageBase):
    id: str
    conversation_id: str
    created_at: datetime
    revision: int

class MessageEditRequest(BaseModel):
    content: str

class ConversationBase(BaseModel):
    title: Optional[str] = None

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    id: str
    created_at: datetime
    updated_at: datetime

class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse] = Field(default_factory=list)

class ConversationListResponse(BaseModel):
    items: List[ConversationResponse]
    total: int
    page: int
    size: int

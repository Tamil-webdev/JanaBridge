from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.storage.database import get_db
from app.schemas.conversations import (
    ConversationCreate, ConversationResponse, ConversationDetailResponse,
    ConversationListResponse, MessageResponse, MessageEditRequest
)
from app.schemas.chat import ChatRequest
from app.services.conversation_service import ConversationService

router = APIRouter()

@router.post("/", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(conv_in: ConversationCreate, db: Session = Depends(get_db)):
    conv = ConversationService.create_conversation(db, conv_in)
    return ConversationResponse(
        id=conv.id,
        title=conv.title,
        created_at=conv.created_at,
        updated_at=conv.updated_at
    )

@router.get("/", response_model=ConversationListResponse)
def list_conversations(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db)):
    items, total = ConversationService.list_conversations(db, skip=skip, limit=limit)
    response_items = [
        ConversationResponse(
            id=item.id,
            title=item.title,
            created_at=item.created_at,
            updated_at=item.updated_at
        ) for item in items
    ]
    return ConversationListResponse(
        items=response_items,
        total=total,
        page=skip // limit + 1 if limit > 0 else 1,
        size=len(items)
    )

@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation(conversation_id: str, db: Session = Depends(get_db)):
    conv = ConversationService.get_conversation(db, conversation_id)
    messages = [
        MessageResponse(
            id=msg.id,
            conversation_id=msg.conversation_id,
            role=msg.role,
            content=msg.content,
            created_at=msg.created_at,
            revision=msg.revision,
            citations=msg.citations if msg.citations else []
        ) for msg in conv.messages
    ]
    return ConversationDetailResponse(
        id=conv.id,
        title=conv.title,
        created_at=conv.created_at,
        updated_at=conv.updated_at,
        messages=messages
    )

@router.patch("/{conversation_id}", response_model=ConversationResponse)
def update_conversation(conversation_id: str, conv_in: ConversationCreate, db: Session = Depends(get_db)):
    conv = ConversationService.update_conversation(db, conversation_id, conv_in)
    return ConversationResponse(
        id=conv.id,
        title=conv.title,
        created_at=conv.created_at,
        updated_at=conv.updated_at
    )

@router.post("/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def add_message(conversation_id: str, chat_request: ChatRequest, db: Session = Depends(get_db)):
    msg = ConversationService.add_message(db, conversation_id, chat_request)
    return MessageResponse(
        id=msg.id,
        conversation_id=msg.conversation_id,
        role=msg.role,
        content=msg.content,
        created_at=msg.created_at,
        revision=msg.revision,
        citations=msg.citations if msg.citations else []
    )

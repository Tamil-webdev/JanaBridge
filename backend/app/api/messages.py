from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.storage.database import get_db
from app.schemas.conversations import MessageResponse, MessageEditRequest
from app.schemas.chat import ChatRequest
from app.services.conversation_service import ConversationService

router = APIRouter()

@router.patch("/{message_id}", response_model=MessageResponse)
def edit_message(message_id: str, edit_request: MessageEditRequest, db: Session = Depends(get_db)):
    msg = ConversationService.edit_message(db, message_id, edit_request)
    return MessageResponse(
        id=msg.id,
        conversation_id=msg.conversation_id,
        role=msg.role,
        content=msg.content,
        created_at=msg.created_at,
        revision=msg.revision,
        citations=msg.citations if msg.citations else [],
        response_language=msg.response_language,
    )

@router.post("/{message_id}/regenerate", response_model=MessageResponse)
def regenerate_message(message_id: str, chat_request: ChatRequest, db: Session = Depends(get_db)):
    msg = ConversationService.regenerate_message(db, message_id, chat_request)
    return MessageResponse(
        id=msg.id,
        conversation_id=msg.conversation_id,
        role=msg.role,
        content=msg.content,
        created_at=msg.created_at,
        revision=msg.revision,
        citations=msg.citations if msg.citations else [],
        response_language=msg.response_language,
    )

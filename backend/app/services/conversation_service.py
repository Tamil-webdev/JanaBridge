from sqlalchemy.orm import Session
from app.models.conversations import Conversation, Message
from app.schemas.conversations import ConversationCreate, MessageEditRequest
from app.schemas.chat import ChatRequest
from app.services.chat_service import chat_service
from app.core.exceptions import BaseAppException
import json

class ConversationService:
    @staticmethod
    def create_conversation(db: Session, conv_in: ConversationCreate) -> Conversation:
        conv = Conversation(title=conv_in.title)
        db.add(conv)
        db.commit()
        db.refresh(conv)
        return conv

    @staticmethod
    def get_conversation(db: Session, conversation_id: str) -> Conversation:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise BaseAppException(code="CONVERSATION_NOT_FOUND", message="Conversation not found", status_code=404)
        return conv

    @staticmethod
    def list_conversations(db: Session, skip: int = 0, limit: int = 10):
        total = db.query(Conversation).count()
        items = db.query(Conversation).order_by(Conversation.updated_at.desc()).offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def update_conversation(db: Session, conversation_id: str, conv_in: ConversationCreate) -> Conversation:
        conv = ConversationService.get_conversation(db, conversation_id)
        if conv_in.title is not None:
            conv.title = conv_in.title
        db.commit()
        db.refresh(conv)
        return conv

    @staticmethod
    def add_message(db: Session, conversation_id: str, chat_request: ChatRequest) -> Message:
        if not chat_request.message.strip():
            raise BaseAppException(code="EMPTY_MESSAGE", message="Message cannot be empty", status_code=400)

        conv = ConversationService.get_conversation(db, conversation_id)

        # 1. Save User Message
        user_msg = Message(
            conversation_id=conversation_id,
            role="user",
            content=chat_request.message
        )
        db.add(user_msg)
        db.commit()

        # 2. Call Chat Service Stub
        chat_response = chat_service.answer_question(chat_request, db)

        # 3. Save Assistant Message
        citations_json = [c.model_dump() for c in chat_response.citations]
        assistant_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=chat_response.answer,
            citations=citations_json
        )
        db.add(assistant_msg)

        # 4. Update conversation timestamp
        from datetime import datetime, timezone
        conv.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(assistant_msg)
        return assistant_msg

    @staticmethod
    def edit_message(db: Session, message_id: str, edit_request: MessageEditRequest) -> Message:
        if not edit_request.content.strip():
            raise BaseAppException(code="EMPTY_MESSAGE", message="Message cannot be empty", status_code=400)

        msg = db.query(Message).filter(Message.id == message_id).first()
        if not msg:
            raise BaseAppException(code="MESSAGE_NOT_FOUND", message="Message not found", status_code=404)

        # Basic revision strategy: update inline and increment revision.
        # A more advanced strategy would branch the conversation or save history.
        msg.content = edit_request.content
        msg.revision += 1
        db.commit()
        db.refresh(msg)
        return msg

    @staticmethod
    def regenerate_message(db: Session, message_id: str, chat_request: ChatRequest) -> Message:
        # For regenerate, we assume the message_id is the user's message we want to regenerate the response for
        # Or it could be the assistant message that needs replacing. Let's regenerate based on a ChatRequest
        user_msg = db.query(Message).filter(Message.id == message_id).first()
        if not user_msg:
            raise BaseAppException(code="MESSAGE_NOT_FOUND", message="Message not found", status_code=404)

        # Call Chat Service Stub
        chat_response = chat_service.answer_question(chat_request, db)

        citations_json = [c.model_dump() for c in chat_response.citations]
        new_assistant_msg = Message(
            conversation_id=user_msg.conversation_id,
            role="assistant",
            content=chat_response.answer,
            citations=citations_json
        )
        db.add(new_assistant_msg)

        conv = db.query(Conversation).filter(Conversation.id == user_msg.conversation_id).first()
        from datetime import datetime, timezone
        if conv:
            conv.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(new_assistant_msg)
        return new_assistant_msg

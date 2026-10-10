from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatResponse, ChatCitation
import logging

logger = logging.getLogger(__name__)

class ChatServiceStub:
    """
    Development stub for the ChatServiceInterface.
    The core AI/RAG branch will implement the actual logic for this.
    """

    @staticmethod
    def answer_question(request: ChatRequest, db: Session) -> ChatResponse:
        logger.info(f"[DEV STUB] Received chat request: {request.message}")

        # Development stub response. We must NEVER return fabricated government answers or fake citations.
        return ChatResponse(
            status="answered",
            answer="[DEVELOPMENT STUB] This is a stubbed response. The AI/RAG engine has not yet been integrated. No real government scheme information or citations are provided here.",
            citations=[],
            needs_clarification=False,
            limitations=["This is a development stub, not a real AI response."]
        )

# For now, we point the service to the stub.
chat_service = ChatServiceStub()

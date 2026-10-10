from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatResponse, ChatCitation
import logging
from app.rag.rag_pipeline import RAGPipeline
from app.core.config import settings

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        self.rag = RAGPipeline(settings)

    def answer_question(self, request: ChatRequest, db: Session) -> ChatResponse:
        logger.info(f"Received chat request: {request.message}")
        result = self.rag.query(request.message)

        citations = []
        for c in result.citations:
            citations.append(ChatCitation(
                citation_id=str(c["citation_id"]),
                document_id=c.get("source_file", ""),
                source_title=c.get("source_file", ""),
                page=c.get("page_number", 0),
                snippet=c.get("snippet", ""),
            ))

        return ChatResponse(
            status=result.status,
            answer=result.answer,
            citations=citations,
            needs_clarification=False,
            limitations=[],
        )

chat_service = ChatService()

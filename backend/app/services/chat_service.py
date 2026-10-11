from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatResponse, ChatCitation
import logging
from app.rag.rag_pipeline import RAGPipeline
from app.core.config import settings

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        # Lazily initialized to avoid ChromaDB import at module load time
        # (which breaks tests before the mock is applied)
        self._rag: RAGPipeline | None = None

    @property
    def rag(self) -> RAGPipeline:
        if self._rag is None:
            self._rag = RAGPipeline(settings)
        return self._rag

    def answer_question(self, request: ChatRequest, db: Session, history: list = None) -> ChatResponse:
        logger.info(f"Received chat request: {request.message} (lang: {request.language})")
        from app.utils.language_detector import detect_language
        detected_lang = detect_language(request.message, fallback=request.language or "english")

        from app.rag.faq import faq_system
        faq_match = faq_system.match(request.message, history, requested_language=detected_lang)
        if faq_match:
            return faq_match

        result = self.rag.query(request.message, response_language=detected_lang)

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
            response_language=result.response_language or detected_lang,
        )

chat_service = ChatService()

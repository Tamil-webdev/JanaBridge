from fastapi import APIRouter
from app.api import health, schemes, conversations, documents, eligibility, states, services, messages

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(states.router, prefix="/states", tags=["states"])
api_router.include_router(schemes.router, prefix="/schemes", tags=["schemes"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(conversations.router, prefix="/conversations", tags=["conversations"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
# api_router.include_router(eligibility.router, prefix="/eligibility", tags=["eligibility"])

import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.storage.database import get_db
from app.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    health_status = {
        "status": "ok",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "components": {
            "database": "unknown",
            "ollama": "unknown",
        }
    }

    # Check database
    try:
        db.execute(text("SELECT 1"))
        health_status["components"]["database"] = "ok"
    except Exception:
        health_status["components"]["database"] = "unreachable"
        health_status["status"] = "degraded"

    # Check Ollama
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.get(f"{settings.ollama_base_url}/api/tags")
            if response.status_code == 200:
                health_status["components"]["ollama"] = "ok"
            else:
                health_status["components"]["ollama"] = f"error_{response.status_code}"
                health_status["status"] = "degraded"
    except Exception:
        health_status["components"]["ollama"] = "unreachable"
        health_status["status"] = "degraded"

    # We could also check ChromaDB here, but let's stick to the basics first

    return health_status

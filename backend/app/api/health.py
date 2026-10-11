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
        "models": {
            "generation_model": settings.generation_model,
            "embedding_model": settings.embedding_model,
        },
        "components": {
            "database": "unknown",
            "ollama": "unknown",
            "generation_model": "unknown",
            "embedding_model": "unknown",
        }
    }

    # Check database
    try:
        db.execute(text("SELECT 1"))
        health_status["components"]["database"] = "ok"
    except Exception:
        health_status["components"]["database"] = "unreachable"
        health_status["status"] = "degraded"

    # Check Ollama and model availability
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{settings.ollama_base_url}/api/tags")
            if response.status_code == 200:
                health_status["components"]["ollama"] = "ok"
                installed_models = {
                    m.get("model", m.get("name", ""))
                    for m in response.json().get("models", [])
                }
                # Check generation model
                gen_ok = settings.generation_model in installed_models
                health_status["components"]["generation_model"] = (
                    "ok" if gen_ok else f"missing — run: ollama pull {settings.generation_model}"
                )
                # Check embedding model
                emb_ok = settings.embedding_model in installed_models
                health_status["components"]["embedding_model"] = (
                    "ok" if emb_ok else f"missing — run: ollama pull {settings.embedding_model}"
                )
                if not gen_ok or not emb_ok:
                    health_status["status"] = "degraded"
            else:
                health_status["components"]["ollama"] = f"error_{response.status_code}"
                health_status["status"] = "degraded"
    except Exception as exc:
        health_status["components"]["ollama"] = f"unreachable: {exc}"
        health_status["status"] = "degraded"

    return health_status

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from app.core.exceptions import custom_exception_handler
from app.storage.database import engine, Base
import app.models  # Register models

def create_app() -> FastAPI:
    # Initialize database
    Base.metadata.create_all(bind=engine)

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
    )

    # Allow local origins for development (Vite default: 5173, CRA: 3000)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include the API router
    app.include_router(api_router, prefix="/api/v1")

    # Exception handlers
    from app.core.exceptions import BaseAppException
    app.add_exception_handler(BaseAppException, custom_exception_handler)

    return app

app = create_app()

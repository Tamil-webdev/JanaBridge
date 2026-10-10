from fastapi import APIRouter, Depends, UploadFile, File, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.storage.database import get_db
from app.schemas.documents import DocumentResponse, DocumentUploadResponse, DocumentListResponse, DocumentProcessResponse
from app.services.document_service import DocumentService
from app.rag.rag_pipeline import RAGPipeline
from app.core.config import settings

router = APIRouter()

@router.post("/index")
def index_documents():
    rag = RAGPipeline(settings)
    result = rag.index_documents()
    return {
        "status": "indexed",
        "documents_found": result.documents_found,
        "total_pages": result.total_pages,
        "total_chunks": result.total_chunks,
        "message": f"Successfully indexed {result.total_chunks} chunks from {result.documents_found} document(s)."
    }

@router.post("/", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    doc = await DocumentService.upload_document(db, file)
    return DocumentUploadResponse(
        document_id=doc.id,
        filename=doc.filename,
        status=doc.status,
        size_bytes=doc.size_bytes
    )

@router.get("/", response_model=DocumentListResponse)
def list_documents(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db)):
    items, total = DocumentService.get_documents(db, skip=skip, limit=limit)
    response_items = [
        DocumentResponse(
            document_id=item.id,
            filename=item.filename,
            status=item.status,
            size_bytes=item.size_bytes,
            page_count=item.page_count,
            uploaded_at=item.uploaded_at,
            error_message=item.error_message,
            source_type=item.source_type
        ) for item in items
    ]
    return DocumentListResponse(
        items=response_items,
        total=total,
        page=skip // limit + 1 if limit > 0 else 1,
        size=len(items)
    )

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str, db: Session = Depends(get_db)):
    item = DocumentService.get_document(db, document_id)
    return DocumentResponse(
        document_id=item.id,
        filename=item.filename,
        status=item.status,
        size_bytes=item.size_bytes,
        page_count=item.page_count,
        uploaded_at=item.uploaded_at,
        error_message=item.error_message,
        source_type=item.source_type
    )

@router.post("/{document_id}/process", response_model=DocumentProcessResponse)
def process_document(document_id: str, db: Session = Depends(get_db)):
    return DocumentService.process_document(db, document_id)

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: str, db: Session = Depends(get_db)):
    DocumentService.delete_document(db, document_id)
    return

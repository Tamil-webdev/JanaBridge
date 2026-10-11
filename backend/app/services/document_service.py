import os
import shutil
import uuid
import fitz  # PyMuPDF
from fastapi import UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pathlib import Path

from app.models.documents import Document, DocumentPage
from app.core.config import settings
from app.core.exceptions import BaseAppException
from app.schemas.documents import DocumentProcessResponse

class DocumentService:
    @staticmethod
    def ensure_dir():
        os.makedirs(settings.document_dir, exist_ok=True)

    @staticmethod
    async def upload_document(db: Session, file: UploadFile) -> Document:
        if not file.filename.lower().endswith(".pdf"):
            raise BaseAppException(code="INVALID_FILE_TYPE", message="Only PDF files are allowed", status_code=400)

        DocumentService.ensure_dir()

        doc_id = str(uuid.uuid4())
        safe_filename = f"{doc_id}.pdf"
        storage_path = os.path.join(settings.document_dir, safe_filename)

        # Enforce size limit while writing
        max_bytes = settings.max_upload_size_mb * 1024 * 1024
        bytes_written = 0

        with open(storage_path, "wb") as f:
            while chunk := await file.read(8192):
                bytes_written += len(chunk)
                if bytes_written > max_bytes:
                    f.close()
                    os.remove(storage_path)
                    raise BaseAppException(code="FILE_TOO_LARGE", message=f"File exceeds maximum size of {settings.max_upload_size_mb} MB", status_code=400)
                f.write(chunk)

        # Basic PDF validation with fitz to ensure it is a valid PDF
        try:
            doc_fitz = fitz.open(storage_path)
            doc_fitz.close()
        except Exception:
            try:
                os.remove(storage_path)
            except OSError:
                pass
            raise BaseAppException(code="INVALID_PDF", message="The uploaded file is not a valid PDF", status_code=400)

        db_doc = Document(
            id=doc_id,
            filename=file.filename,
            storage_key=safe_filename,
            mime_type="application/pdf",
            size_bytes=bytes_written,
            status="uploaded"
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
        return db_doc

    @staticmethod
    def process_document(db: Session, document_id: str) -> DocumentProcessResponse:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise BaseAppException(code="DOCUMENT_NOT_FOUND", message="Document not found", status_code=404)

        storage_path = os.path.join(settings.document_dir, doc.storage_key)
        if not os.path.exists(storage_path):
            doc.status = "failed"
            doc.error_message = "File missing from storage"
            db.commit()
            raise BaseAppException(code="FILE_MISSING", message="File missing from local storage", status_code=500)

        doc.status = "processing"
        db.commit()

        pages_with_text = 0
        pages_without_text = []

        try:
            # Delete any existing pages for idempotency
            db.query(DocumentPage).filter(DocumentPage.document_id == document_id).delete()
            db.commit()

            fitz_doc = fitz.open(storage_path)
            doc.page_count = len(fitz_doc)

            for page_num in range(doc.page_count):
                page = fitz_doc.load_page(page_num)
                text = page.get_text()

                # We use 1-based indexing for pages
                current_page_number = page_num + 1

                if text.strip():
                    pages_with_text += 1
                else:
                    pages_without_text.append(current_page_number)

                db_page = DocumentPage(
                    document_id=document_id,
                    page_number=current_page_number,
                    extracted_text=text
                )
                db.add(db_page)

            fitz_doc.close()

            # Check if entire document is empty
            if pages_with_text == 0:
                doc.status = "processed_no_text"
                doc.error_message = "No extractable text found in document"
            else:
                doc.status = "processed"
                doc.error_message = None

            db.commit()

        except Exception as e:
            db.rollback()
            doc.status = "failed"
            doc.error_message = str(e)
            db.commit()
            raise BaseAppException(code="PROCESSING_FAILED", message=f"Failed to process document: {str(e)}", status_code=500)

        return DocumentProcessResponse(
            document_id=doc.id,
            status=doc.status,
            page_count=doc.page_count,
            pages_with_text=pages_with_text,
            pages_without_text=pages_without_text
        )

    @staticmethod
    def get_document(db: Session, document_id: str) -> Document:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise BaseAppException(code="DOCUMENT_NOT_FOUND", message="Document not found", status_code=404)
        return doc

    @staticmethod
    def get_documents(db: Session, skip: int = 0, limit: int = 10):
        total = db.query(Document).count()
        items = db.query(Document).order_by(Document.uploaded_at.desc()).offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def delete_document(db: Session, document_id: str):
        doc = DocumentService.get_document(db, document_id)
        storage_path = os.path.join(settings.document_dir, doc.storage_key)

        db.delete(doc) # Cascade will delete pages
        db.commit()

        if os.path.exists(storage_path):
            os.remove(storage_path)

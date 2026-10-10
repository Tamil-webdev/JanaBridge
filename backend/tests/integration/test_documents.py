import pytest
import os
import fitz
import io
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.storage.database import get_db, Base
from app.core.config import settings

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_documents.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="session", autouse=True)
def setup_db_and_config():
    Base.metadata.create_all(bind=engine)
    settings.document_dir = "./test_data_docs"
    os.makedirs(settings.document_dir, exist_ok=True)
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    try:
        if os.path.exists("./test_documents.db"):
            os.remove("./test_documents.db")
    except OSError:
        pass
    import shutil
    if os.path.exists("./test_data_docs"):
        shutil.rmtree("./test_data_docs")

client = TestClient(app)

def create_dummy_pdf(text: str = "Hello World", empty: bool = False) -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    if not empty:
        page.insert_text((50, 50), text)
    return doc.write()

def create_corrupt_pdf() -> bytes:
    return b"%PDF-1.4\n%This is a corrupt PDF file with no real objects."

def test_upload_wrong_extension():
    response = client.post("/api/v1/documents/", files={"file": ("test.txt", b"Hello", "text/plain")})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "INVALID_FILE_TYPE"

def test_upload_corrupt_pdf():
    corrupt_data = create_corrupt_pdf()
    response = client.post("/api/v1/documents/", files={"file": ("corrupt.pdf", corrupt_data, "application/pdf")})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "INVALID_PDF"

def test_upload_oversized_pdf(monkeypatch):
    monkeypatch.setattr(settings, "max_upload_size_mb", 0.000001) # 1 byte limit
    pdf_data = create_dummy_pdf()
    response = client.post("/api/v1/documents/", files={"file": ("oversize.pdf", pdf_data, "application/pdf")})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "FILE_TOO_LARGE"
    monkeypatch.setattr(settings, "max_upload_size_mb", 10)

def helper_upload_valid_pdf():
    pdf_data = create_dummy_pdf("Valid PDF content")
    response = client.post("/api/v1/documents/", files={"file": ("valid.pdf", pdf_data, "application/pdf")})
    assert response.status_code == 201
    data = response.json()
    assert data["filename"] == "valid.pdf"
    assert data["status"] == "uploaded"
    assert "document_id" in data
    return data["document_id"]

def test_upload_valid_pdf():
    helper_upload_valid_pdf()

def test_get_document():
    doc_id = helper_upload_valid_pdf()
    response = client.get(f"/api/v1/documents/{doc_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["document_id"] == doc_id
    assert data["status"] == "uploaded"

def test_get_unknown_document():
    response = client.get("/api/v1/documents/non-existent-uuid")
    assert response.status_code == 404

def test_list_documents():
    response = client.get("/api/v1/documents/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] > 0

def test_process_document():
    doc_id = helper_upload_valid_pdf()
    response = client.post(f"/api/v1/documents/{doc_id}/process")
    assert response.status_code == 200
    data = response.json()
    assert data["document_id"] == doc_id
    assert data["status"] == "processed"
    assert data["page_count"] == 1
    assert data["pages_with_text"] == 1
    assert data["pages_without_text"] == []

def test_process_document_no_text():
    pdf_data = create_dummy_pdf(empty=True)
    res_upload = client.post("/api/v1/documents/", files={"file": ("empty.pdf", pdf_data, "application/pdf")})
    doc_id = res_upload.json()["document_id"]

    res_process = client.post(f"/api/v1/documents/{doc_id}/process")
    assert res_process.status_code == 200
    data = res_process.json()
    assert data["status"] == "processed_no_text"
    assert data["page_count"] == 1
    assert data["pages_with_text"] == 0
    assert data["pages_without_text"] == [1]

def test_process_document_idempotency():
    doc_id = helper_upload_valid_pdf()
    res1 = client.post(f"/api/v1/documents/{doc_id}/process")
    assert res1.status_code == 200

    # Process again
    res2 = client.post(f"/api/v1/documents/{doc_id}/process")
    assert res2.status_code == 200

    # Check if duplicate pages exist via DB
    db = TestingSessionLocal()
    from app.models.documents import DocumentPage
    pages = db.query(DocumentPage).filter(DocumentPage.document_id == doc_id).all()
    assert len(pages) == 1
    db.close()

def test_delete_document():
    doc_id = helper_upload_valid_pdf()
    client.post(f"/api/v1/documents/{doc_id}/process")

    res_delete = client.delete(f"/api/v1/documents/{doc_id}")
    assert res_delete.status_code == 204

    # Check it's gone
    res_get = client.get(f"/api/v1/documents/{doc_id}")
    assert res_get.status_code == 404

    db = TestingSessionLocal()
    from app.models.documents import DocumentPage
    pages = db.query(DocumentPage).filter(DocumentPage.document_id == doc_id).all()
    assert len(pages) == 0
    db.close()

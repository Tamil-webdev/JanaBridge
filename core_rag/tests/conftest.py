"""
Shared fixtures for BOOKMARK backend tests.

All tests that touch Ollama mock the HTTP calls so they run without
a live model.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

import sys
from unittest.mock import MagicMock

# Create a mock chromadb module
mock_chromadb = MagicMock()

# Mock the PersistentClient class
class MockClient:
    def __init__(self, path=None):
        self.path = path
        self._collections = {}

    def get_or_create_collection(self, name, metadata=None):
        if name not in self._collections:
            self._collections[name] = MockCollection(name)
        return self._collections[name]

    def delete_collection(self, name):
        if name in self._collections:
            del self._collections[name]

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.items = {}
        
    def upsert(self, ids, embeddings, metadatas, documents):
        for i in range(len(ids)):
            self.items[ids[i]] = {
                "embedding": embeddings[i],
                "metadata": metadatas[i],
                "document": documents[i]
            }
            
    def count(self):
        return len(self.items)
        
    def query(self, query_embeddings, n_results, include=None):
        # Return dummy results matching the expected shape
        ids = list(self.items.keys())[:n_results]
        metadatas = [self.items[i]["metadata"] for i in ids]
        documents = [self.items[i]["document"] for i in ids]
        distances = [0.1 * i for i in range(len(ids))]
        
        return {
            "ids": [ids],
            "metadatas": [metadatas],
            "documents": [documents],
            "distances": [distances]
        }

mock_chromadb.PersistentClient = MockClient

# Inject it into sys.modules
sys.modules['chromadb'] = mock_chromadb


import fitz  # PyMuPDF
import pytest

from core_rag.config import Settings


@pytest.fixture()
def tmp_dir(tmp_path: Path) -> Path:
    """Return a clean temporary directory."""
    return tmp_path


@pytest.fixture()
def sample_pdf(tmp_path: Path) -> Path:
    """Create a minimal 2-page PDF for testing.

    Page 1 contains text about a fictional government scheme.
    Page 2 contains eligibility criteria.
    """
    pdf_path = tmp_path / "test_scheme.pdf"
    doc = fitz.open()  # new empty PDF

    # Page 1
    page1 = doc.new_page(width=595, height=842)
    page1.insert_text(
        (72, 72),
        "Tamil Nadu Chief Minister's Solar Rooftop Scheme 2024\n\n"
        "The Government of Tamil Nadu has launched the Solar Rooftop "
        "Scheme to promote renewable energy adoption among residential "
        "households. Under this scheme, eligible families can receive a "
        "subsidy of up to Rs. 50,000 for installing solar panels on "
        "their rooftops. The scheme is administered by TEDA (Tamil Nadu "
        "Energy Development Agency).\n\n"
        "Applications can be submitted online through the official TEDA "
        "portal or at district collector offices across the state.",
        fontsize=11,
    )

    # Page 2
    page2 = doc.new_page(width=595, height=842)
    page2.insert_text(
        (72, 72),
        "Eligibility Criteria:\n\n"
        "1. The applicant must be a resident of Tamil Nadu.\n"
        "2. Annual household income must not exceed Rs. 3,00,000.\n"
        "3. The applicant must own the property where solar panels "
        "will be installed.\n"
        "4. Previous beneficiaries of any state solar subsidy are "
        "not eligible.\n\n"
        "Required Documents:\n"
        "- Aadhaar Card\n"
        "- Proof of residence\n"
        "- Income certificate\n"
        "- Property ownership documents",
        fontsize=11,
    )

    doc.save(str(pdf_path))
    doc.close()
    return pdf_path


@pytest.fixture()
def docs_dir(tmp_path: Path, sample_pdf: Path) -> Path:
    """Return a documents directory containing the sample PDF."""
    docs = tmp_path / "documents"
    docs.mkdir()
    # Copy sample PDF into the documents directory
    import shutil
    shutil.copy2(sample_pdf, docs / sample_pdf.name)
    return docs


@pytest.fixture()
def test_settings(tmp_path: Path, docs_dir: Path) -> Settings:
    """Settings pointing at temporary directories for isolated tests."""
    return Settings(
        documents_dir=str(docs_dir),
        chroma_dir=str(tmp_path / "chroma"),
        bm25_index_path=str(tmp_path / "bm25_index.pkl"),
        ollama_base_url="http://localhost:11434",
        chunk_size=256,
        chunk_overlap=32,
    )

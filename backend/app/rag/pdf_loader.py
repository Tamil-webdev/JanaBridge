"""
PDF document loader using PyMuPDF (``fitz``).

Responsibilities:
- Scan a directory for ``*.pdf`` files.
- Extract text page-by-page preserving filename and 1-based page number.
- Raise clear errors for missing directories, no PDFs, or empty extractions.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path

import fitz  # PyMuPDF

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class PageText:
    """Extracted text from a single PDF page."""
    source_file: str    # original filename (not full path)
    page_number: int    # 1-based
    text: str


class PDFLoadError(Exception):
    """Raised when PDF loading fails in a user-actionable way."""


def discover_pdfs(directory: Path) -> list[Path]:
    """Return sorted list of PDF files in *directory*.

    Raises ``PDFLoadError`` if the directory does not exist or contains
    no PDFs.
    """
    if not directory.exists():
        raise PDFLoadError(
            f"Documents directory does not exist: {directory}"
        )
    if not directory.is_dir():
        raise PDFLoadError(
            f"Documents path is not a directory: {directory}"
        )

    pdfs = sorted(directory.glob("*.pdf"))
    if not pdfs:
        raise PDFLoadError(
            f"No PDF files found in: {directory}"
        )
    return pdfs


def extract_pages(pdf_path: Path) -> list[PageText]:
    """Extract text from every page of a single PDF file.

    Returns a list of ``PageText`` with 1-based page numbers.
    Raises ``PDFLoadError`` if the file cannot be opened or yields no text.
    """
    filename = pdf_path.name
    pages: list[PageText] = []

    try:
        doc = fitz.open(str(pdf_path))
    except Exception as exc:
        raise PDFLoadError(
            f"Cannot open PDF '{filename}': {exc}"
        ) from exc

    try:
        for page_idx in range(len(doc)):
            page = doc[page_idx]
            text = page.get_text("text")
            if text and text.strip():
                pages.append(PageText(
                    source_file=filename,
                    page_number=page_idx + 1,  # 1-based
                    text=text,
                ))
    finally:
        doc.close()

    if not pages:
        raise PDFLoadError(
            f"PDF '{filename}' produced no extractable text "
            f"(scanned / image-only PDF?)."
        )

    logger.info("Extracted %d pages from %s", len(pages), filename)
    return pages


def load_all_pdfs(directory: Path) -> list[PageText]:
    """Discover and extract text from all PDFs in *directory*."""
    pdf_paths = discover_pdfs(directory)
    all_pages: list[PageText] = []
    for pdf_path in pdf_paths:
        all_pages.extend(extract_pages(pdf_path))
    logger.info(
        "Loaded %d pages from %d PDFs in %s",
        len(all_pages), len(pdf_paths), directory,
    )
    return all_pages

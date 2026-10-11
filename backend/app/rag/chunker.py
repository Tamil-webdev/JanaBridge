"""
Text chunking with overlap and metadata preservation.

Splits page text into fixed-size character chunks with configurable
overlap.  Each chunk carries its source filename, page number, and a
deterministic ``chunk_id`` derived from content-addressing so that
re-indexing the same document does not create duplicates.
"""

from __future__ import annotations

import hashlib
import logging
from dataclasses import dataclass

from app.rag.pdf_loader import PageText

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Chunk:
    """A text chunk with full provenance metadata."""
    chunk_id: str        # deterministic hash for deduplication
    source_file: str     # original PDF filename
    page_number: int     # 1-based page number
    chunk_index: int     # 0-based index within the page
    text: str


def _make_chunk_id(source_file: str, page_number: int, chunk_index: int) -> str:
    """Deterministic chunk ID from file + page + index."""
    key = f"{source_file}::{page_number}::{chunk_index}"
    return hashlib.sha256(key.encode("utf-8")).hexdigest()[:16]


def chunk_page(
    page: PageText,
    chunk_size: int = 512,
    chunk_overlap: int = 64,
) -> list[Chunk]:
    """Split a single page's text into overlapping chunks.

    Parameters
    ----------
    page : PageText
        The page to chunk.
    chunk_size : int
        Maximum characters per chunk.
    chunk_overlap : int
        Number of overlapping characters between consecutive chunks.

    Returns
    -------
    list[Chunk]
        May be empty if the page text is blank after stripping.
    """
    text = page.text.strip()
    if not text:
        return []

    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive")
    if chunk_overlap < 0:
        raise ValueError("chunk_overlap must be non-negative")
    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be less than chunk_size")

    step = chunk_size - chunk_overlap
    chunks: list[Chunk] = []
    idx = 0
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk_text = text[start:end]
        chunks.append(Chunk(
            chunk_id=_make_chunk_id(page.source_file, page.page_number, idx),
            source_file=page.source_file,
            page_number=page.page_number,
            chunk_index=idx,
            text=chunk_text,
        ))
        idx += 1
        start += step

    return chunks


def chunk_pages(
    pages: list[PageText],
    chunk_size: int = 512,
    chunk_overlap: int = 64,
) -> list[Chunk]:
    """Chunk all pages and return a flat list of ``Chunk`` objects."""
    all_chunks: list[Chunk] = []
    for page in pages:
        all_chunks.extend(chunk_page(page, chunk_size, chunk_overlap))
    logger.info("Created %d chunks from %d pages", len(all_chunks), len(pages))
    return all_chunks

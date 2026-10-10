"""Tests for text chunking and metadata preservation."""

from __future__ import annotations

import pytest

from app.rag.chunker import Chunk, chunk_page, chunk_pages
from app.rag.pdf_loader import PageText


@pytest.fixture()
def page() -> PageText:
    """A page with exactly 100 characters of text."""
    return PageText(
        source_file="doc.pdf",
        page_number=3,
        text="A" * 100,
    )


class TestChunkPage:
    def test_single_chunk_for_short_text(self) -> None:
        page = PageText(source_file="f.pdf", page_number=1, text="Hello world")
        chunks = chunk_page(page, chunk_size=512, chunk_overlap=64)
        assert len(chunks) == 1
        assert chunks[0].text == "Hello world"

    def test_chunk_metadata_preserved(self) -> None:
        page = PageText(source_file="scheme.pdf", page_number=5, text="x" * 100)
        chunks = chunk_page(page, chunk_size=50, chunk_overlap=10)
        for c in chunks:
            assert c.source_file == "scheme.pdf"
            assert c.page_number == 5

    def test_chunk_overlap(self) -> None:
        page = PageText(source_file="f.pdf", page_number=1, text="ABCDEFGHIJKLMNOPQRST")
        # chunk_size=10, overlap=3 → step=7
        chunks = chunk_page(page, chunk_size=10, chunk_overlap=3)
        assert len(chunks) >= 2
        # Second chunk should start at position 7
        assert chunks[1].text[:3] == chunks[0].text[7:10]

    def test_chunk_indices_are_sequential(self, page: PageText) -> None:
        chunks = chunk_page(page, chunk_size=30, chunk_overlap=5)
        indices = [c.chunk_index for c in chunks]
        assert indices == list(range(len(chunks)))

    def test_deterministic_chunk_ids(self, page: PageText) -> None:
        chunks1 = chunk_page(page, chunk_size=30, chunk_overlap=5)
        chunks2 = chunk_page(page, chunk_size=30, chunk_overlap=5)
        ids1 = [c.chunk_id for c in chunks1]
        ids2 = [c.chunk_id for c in chunks2]
        assert ids1 == ids2

    def test_different_pages_different_ids(self) -> None:
        p1 = PageText(source_file="f.pdf", page_number=1, text="same text")
        p2 = PageText(source_file="f.pdf", page_number=2, text="same text")
        c1 = chunk_page(p1, chunk_size=512, chunk_overlap=64)
        c2 = chunk_page(p2, chunk_size=512, chunk_overlap=64)
        assert c1[0].chunk_id != c2[0].chunk_id

    def test_empty_page_returns_no_chunks(self) -> None:
        page = PageText(source_file="f.pdf", page_number=1, text="   \n  ")
        chunks = chunk_page(page, chunk_size=512, chunk_overlap=64)
        assert chunks == []

    def test_invalid_chunk_size_raises(self) -> None:
        page = PageText(source_file="f.pdf", page_number=1, text="hello")
        with pytest.raises(ValueError, match="chunk_size must be positive"):
            chunk_page(page, chunk_size=0, chunk_overlap=0)

    def test_overlap_exceeds_size_raises(self) -> None:
        page = PageText(source_file="f.pdf", page_number=1, text="hello")
        with pytest.raises(ValueError, match="chunk_overlap must be less"):
            chunk_page(page, chunk_size=10, chunk_overlap=10)


class TestChunkPages:
    def test_chunks_multiple_pages(self) -> None:
        pages = [
            PageText(source_file="f.pdf", page_number=1, text="A" * 100),
            PageText(source_file="f.pdf", page_number=2, text="B" * 100),
        ]
        chunks = chunk_pages(pages, chunk_size=60, chunk_overlap=10)
        assert len(chunks) >= 4  # at least 2 chunks per page
        # Check both pages represented
        page_nums = {c.page_number for c in chunks}
        assert page_nums == {1, 2}

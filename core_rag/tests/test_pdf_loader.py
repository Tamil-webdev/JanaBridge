"""Tests for PDF loading and text extraction."""

from __future__ import annotations

from pathlib import Path

import fitz
import pytest

from core_rag.pdf_loader import (
    PDFLoadError,
    PageText,
    discover_pdfs,
    extract_pages,
    load_all_pdfs,
)


class TestDiscoverPdfs:
    def test_finds_pdfs(self, docs_dir: Path) -> None:
        pdfs = discover_pdfs(docs_dir)
        assert len(pdfs) == 1
        assert pdfs[0].name == "test_scheme.pdf"

    def test_raises_on_missing_directory(self, tmp_dir: Path) -> None:
        with pytest.raises(PDFLoadError, match="does not exist"):
            discover_pdfs(tmp_dir / "nonexistent")

    def test_raises_on_empty_directory(self, tmp_dir: Path) -> None:
        empty = tmp_dir / "empty"
        empty.mkdir()
        with pytest.raises(PDFLoadError, match="No PDF files found"):
            discover_pdfs(empty)


class TestExtractPages:
    def test_extracts_two_pages(self, sample_pdf: Path) -> None:
        pages = extract_pages(sample_pdf)
        assert len(pages) == 2

    def test_page_numbers_are_one_based(self, sample_pdf: Path) -> None:
        pages = extract_pages(sample_pdf)
        assert pages[0].page_number == 1
        assert pages[1].page_number == 2

    def test_preserves_filename(self, sample_pdf: Path) -> None:
        pages = extract_pages(sample_pdf)
        assert all(p.source_file == "test_scheme.pdf" for p in pages)

    def test_page1_contains_scheme_name(self, sample_pdf: Path) -> None:
        pages = extract_pages(sample_pdf)
        assert "Solar Rooftop Scheme" in pages[0].text

    def test_page2_contains_eligibility(self, sample_pdf: Path) -> None:
        pages = extract_pages(sample_pdf)
        assert "Eligibility" in pages[1].text

    def test_raises_on_corrupt_file(self, tmp_dir: Path) -> None:
        bad_pdf = tmp_dir / "bad.pdf"
        bad_pdf.write_bytes(b"this is not a PDF")
        with pytest.raises(PDFLoadError, match="Cannot open PDF"):
            extract_pages(bad_pdf)

    def test_raises_on_image_only_pdf(self, tmp_dir: Path) -> None:
        """A PDF with only a drawing and no text should raise."""
        pdf_path = tmp_dir / "image_only.pdf"
        doc = fitz.open()
        page = doc.new_page(width=200, height=200)
        # Draw a rectangle instead of inserting text
        page.draw_rect(fitz.Rect(10, 10, 190, 190), color=(0, 0, 0))
        doc.save(str(pdf_path))
        doc.close()
        with pytest.raises(PDFLoadError, match="no extractable text"):
            extract_pages(pdf_path)


class TestLoadAllPdfs:
    def test_loads_from_directory(self, docs_dir: Path) -> None:
        pages = load_all_pdfs(docs_dir)
        assert len(pages) == 2
        assert all(isinstance(p, PageText) for p in pages)

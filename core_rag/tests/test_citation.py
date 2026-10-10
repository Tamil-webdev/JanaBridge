"""Tests for citation mapping, validation, and integrity.

Citation metadata must always come from stored chunk metadata, never
from model-generated filenames, pages, or snippets.
"""

from __future__ import annotations

from core_rag.generator import (
    _build_evidence_block,
    _extract_citation_ids,
    validate_citations,
)
from core_rag.retriever import RetrievedChunk


def _make_chunk(cid: str, source: str = "doc.pdf", page: int = 1, text: str = "sample") -> RetrievedChunk:
    return RetrievedChunk(
        chunk_id=cid,
        source_file=source,
        page_number=page,
        text=text,
        rrf_score=0.5,
        semantic_distance=0.3,
    )


class TestBuildEvidenceBlock:
    def test_assigns_sequential_ids(self) -> None:
        chunks = [_make_chunk("a"), _make_chunk("b"), _make_chunk("c")]
        _text, cmap = _build_evidence_block(chunks)
        assert list(cmap.keys()) == [1, 2, 3]

    def test_evidence_block_contains_source_info(self) -> None:
        chunks = [_make_chunk("a", source="scheme.pdf", page=5)]
        text, _ = _build_evidence_block(chunks)
        assert "scheme.pdf" in text
        assert "Page 5" in text


class TestExtractCitationIds:
    def test_extracts_valid_ids(self) -> None:
        text = "Based on [1] and [3], the answer is clear."
        assert _extract_citation_ids(text) == {1, 3}

    def test_handles_no_citations(self) -> None:
        assert _extract_citation_ids("No citations here.") == set()

    def test_handles_repeated_citations(self) -> None:
        text = "See [1] and also [1]."
        assert _extract_citation_ids(text) == {1}


class TestValidateCitations:
    def test_valid_citations_preserved(self) -> None:
        chunks = [
            _make_chunk("a", source="file1.pdf", page=1, text="Evidence text one"),
            _make_chunk("b", source="file2.pdf", page=3, text="Evidence text two"),
        ]
        _, cmap = _build_evidence_block(chunks)

        answer = "The scheme provides help [1] and requires documents [2]."
        cleaned, citations = validate_citations(answer, cmap)

        assert "[1]" in cleaned
        assert "[2]" in cleaned
        assert len(citations) == 2
        assert citations[0]["citation_id"] == 1
        assert citations[0]["source_file"] == "file1.pdf"
        assert citations[0]["page_number"] == 1
        assert citations[1]["citation_id"] == 2
        assert citations[1]["source_file"] == "file2.pdf"
        assert citations[1]["page_number"] == 3

    def test_invalid_citation_ids_stripped(self) -> None:
        chunks = [_make_chunk("a", source="f.pdf", page=1)]
        _, cmap = _build_evidence_block(chunks)

        answer = "See [1] and [99] for details."
        cleaned, citations = validate_citations(answer, cmap)

        assert "[1]" in cleaned
        assert "[99]" not in cleaned
        assert len(citations) == 1
        assert citations[0]["citation_id"] == 1

    def test_no_citations_returns_empty(self) -> None:
        chunks = [_make_chunk("a")]
        _, cmap = _build_evidence_block(chunks)

        answer = "A general statement with no citations."
        cleaned, citations = validate_citations(answer, cmap)

        assert citations == []

    def test_citation_metadata_from_chunk_not_model(self) -> None:
        """Even if the model says 'file X, page Y', the citation
        metadata must come from the stored chunk, not parsed from
        the model's text."""
        chunk = _make_chunk(
            "a", source="real_source.pdf", page=7,
            text="Actual evidence content here.",
        )
        _, cmap = _build_evidence_block([chunk])

        # Model makes up a wrong filename and page in its prose
        answer = (
            "According to fake_file.pdf page 99, the answer is yes [1]."
        )
        _, citations = validate_citations(answer, cmap)

        # Citation metadata must come from the chunk, not the model
        assert citations[0]["source_file"] == "real_source.pdf"
        assert citations[0]["page_number"] == 7
        assert "Actual evidence" in citations[0]["snippet"]

    def test_snippet_comes_from_chunk_text(self) -> None:
        chunk = _make_chunk("a", text="This is the original chunk text for testing.")
        _, cmap = _build_evidence_block([chunk])
        answer = "Yes [1]."
        _, citations = validate_citations(answer, cmap)
        assert "original chunk text" in citations[0]["snippet"]

    def test_snippet_truncated_for_long_text(self) -> None:
        long_text = "X" * 500
        chunk = _make_chunk("a", text=long_text)
        _, cmap = _build_evidence_block([chunk])
        answer = "See [1]."
        _, citations = validate_citations(answer, cmap)
        assert len(citations[0]["snippet"]) < 250
        assert citations[0]["snippet"].endswith("…")

    def test_all_invalid_ids_returns_empty_citations(self) -> None:
        chunks = [_make_chunk("a")]
        _, cmap = _build_evidence_block(chunks)
        answer = "See [50] and [100]."
        cleaned, citations = validate_citations(answer, cmap)
        assert citations == []
        assert "[50]" not in cleaned

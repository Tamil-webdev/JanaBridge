"""Tests for insufficient-evidence detection.

The system must refuse to answer when indexed evidence is insufficient,
using a configurable semantic distance threshold as an initial heuristic.
"""

from __future__ import annotations

from app.rag.retriever import RetrievedChunk, check_relevance
from app.rag.vector_store import VectorResult


def _make_vr(distance: float, chunk_id: str = "c1") -> VectorResult:
    return VectorResult(
        chunk_id=chunk_id,
        source_file="f.pdf",
        page_number=1,
        text="text",
        distance=distance,
    )


class TestCheckRelevance:
    def test_all_close_returns_relevant(self) -> None:
        results = [_make_vr(0.3, f"c{i}") for i in range(5)]
        assert check_relevance(
            results, max_distance=1.0, min_fraction=0.2,
        ) is True

    def test_all_distant_returns_irrelevant(self) -> None:
        results = [_make_vr(1.8, f"c{i}") for i in range(5)]
        assert check_relevance(
            results, max_distance=1.0, min_fraction=0.2,
        ) is False

    def test_mixed_results_fraction_check(self) -> None:
        # 2 out of 10 are close → 20% → at threshold
        results = [_make_vr(0.5, f"close{i}") for i in range(2)]
        results += [_make_vr(1.5, f"far{i}") for i in range(8)]
        assert check_relevance(
            results, max_distance=1.0, min_fraction=0.2,
        ) is True

    def test_just_below_fraction_threshold(self) -> None:
        # 1 out of 10 → 10% < 20%
        results = [_make_vr(0.5, "close0")]
        results += [_make_vr(1.5, f"far{i}") for i in range(9)]
        assert check_relevance(
            results, max_distance=1.0, min_fraction=0.2,
        ) is False

    def test_empty_results_returns_irrelevant(self) -> None:
        assert check_relevance(
            [], max_distance=1.0, min_fraction=0.2,
        ) is False

    def test_configurable_thresholds(self) -> None:
        results = [_make_vr(1.3, f"c{i}") for i in range(5)]
        # Strict threshold fails
        assert check_relevance(
            results, max_distance=1.0, min_fraction=0.2,
        ) is False
        # Relaxed threshold passes
        assert check_relevance(
            results, max_distance=1.5, min_fraction=0.2,
        ) is True


class TestInsufficientEvidenceInPipeline:
    """Test the pipeline's insufficient-evidence response.

    These use a mock to avoid needing live Ollama.
    """

    def test_empty_index_returns_insufficient(self, test_settings) -> None:
        from app.rag.rag_pipeline import RAGPipeline

        pipeline = RAGPipeline(test_settings)
        # Don't index anything — vector store is empty
        result = pipeline.query("What is the solar scheme?")
        assert result.status == "insufficient_evidence"
        assert "index" in result.answer.lower() or "indexed" in result.answer.lower()
        assert result.citations == []

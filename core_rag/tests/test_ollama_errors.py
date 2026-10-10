"""Tests for Ollama connection error handling.

All HTTP calls are mocked — no live Ollama instance needed.
"""

from __future__ import annotations

from unittest.mock import patch

import httpx
import pytest

from core_rag.embedder import EmbeddingError, embed_single, embed_texts
from core_rag.generator import GenerationError, generate_answer
from core_rag.retriever import RetrievedChunk


class TestEmbedderErrors:
    def test_connection_refused(self) -> None:
        with patch("core_rag.embedder.httpx.post") as mock_post:
            mock_post.side_effect = httpx.ConnectError("Connection refused")
            with pytest.raises(EmbeddingError, match="Cannot connect"):
                embed_texts(
                    ["hello"],
                    model="test-model",
                    base_url="http://localhost:99999",
                )

    def test_timeout(self) -> None:
        with patch("core_rag.embedder.httpx.post") as mock_post:
            mock_post.side_effect = httpx.ReadTimeout("Timed out")
            with pytest.raises(EmbeddingError, match="timed out"):
                embed_texts(
                    ["hello"],
                    model="test-model",
                    base_url="http://localhost:11434",
                    timeout=1.0,
                )

    def test_model_not_found(self) -> None:
        with patch("core_rag.embedder.httpx.post") as mock_post:
            mock_post.return_value = httpx.Response(
                status_code=404,
                text='{"error": "model not found"}',
                request=httpx.Request("POST", "http://localhost:11434/api/embed"),
            )
            with pytest.raises(EmbeddingError, match="404"):
                embed_texts(
                    ["hello"],
                    model="nonexistent",
                    base_url="http://localhost:11434",
                )

    def test_empty_input_returns_empty(self) -> None:
        result = embed_texts(
            [],
            model="test-model",
            base_url="http://localhost:11434",
        )
        assert result == []

    def test_successful_batch(self) -> None:
        with patch("core_rag.embedder.httpx.post") as mock_post:
            mock_post.return_value = httpx.Response(
                status_code=200,
                json={"embeddings": [[0.1, 0.2], [0.3, 0.4]]},
                request=httpx.Request("POST", "http://localhost:11434/api/embed"),
            )
            result = embed_texts(
                ["hello", "world"],
                model="test-model",
                base_url="http://localhost:11434",
            )
            assert len(result) == 2
            assert result[0] == [0.1, 0.2]

    def test_mismatched_response_length(self) -> None:
        with patch("core_rag.embedder.httpx.post") as mock_post:
            mock_post.return_value = httpx.Response(
                status_code=200,
                json={"embeddings": [[0.1]]},  # sent 2, got 1
                request=httpx.Request("POST", "http://localhost:11434/api/embed"),
            )
            with pytest.raises(EmbeddingError, match="expected 2"):
                embed_texts(
                    ["a", "b"],
                    model="test-model",
                    base_url="http://localhost:11434",
                )


class TestGeneratorErrors:
    def _chunk(self) -> RetrievedChunk:
        return RetrievedChunk(
            chunk_id="test",
            source_file="f.pdf",
            page_number=1,
            text="Evidence text.",
            rrf_score=0.5,
            semantic_distance=0.3,
        )

    def test_connection_refused(self) -> None:
        with patch("core_rag.generator.httpx.post") as mock_post:
            mock_post.side_effect = httpx.ConnectError("refused")
            with pytest.raises(GenerationError, match="Cannot connect"):
                generate_answer(
                    "What?",
                    [self._chunk()],
                    model="test",
                    base_url="http://localhost:99999",
                )

    def test_timeout(self) -> None:
        with patch("core_rag.generator.httpx.post") as mock_post:
            mock_post.side_effect = httpx.ReadTimeout("timeout")
            with pytest.raises(GenerationError, match="timed out"):
                generate_answer(
                    "What?",
                    [self._chunk()],
                    model="test",
                    base_url="http://localhost:11434",
                    timeout=1.0,
                )

    def test_http_error(self) -> None:
        with patch("core_rag.generator.httpx.post") as mock_post:
            mock_post.return_value = httpx.Response(
                status_code=500,
                text="Internal error",
                request=httpx.Request("POST", "http://localhost:11434/api/chat"),
            )
            with pytest.raises(GenerationError, match="500"):
                generate_answer(
                    "What?",
                    [self._chunk()],
                    model="test",
                    base_url="http://localhost:11434",
                )

    def test_empty_response(self) -> None:
        with patch("core_rag.generator.httpx.post") as mock_post:
            mock_post.return_value = httpx.Response(
                status_code=200,
                json={"message": {"content": ""}},
                request=httpx.Request("POST", "http://localhost:11434/api/chat"),
            )
            with pytest.raises(GenerationError, match="empty"):
                generate_answer(
                    "What?",
                    [self._chunk()],
                    model="test",
                    base_url="http://localhost:11434",
                )

    def test_successful_generation_with_citations(self) -> None:
        with patch("core_rag.generator.httpx.post") as mock_post:
            mock_post.return_value = httpx.Response(
                status_code=200,
                json={
                    "message": {
                        "content": "The scheme provides help [1]."
                    }
                },
                request=httpx.Request("POST", "http://localhost:11434/api/chat"),
            )
            answer, citations, cmap = generate_answer(
                "What does the scheme do?",
                [self._chunk()],
                model="test",
                base_url="http://localhost:11434",
            )
            assert "[1]" in answer
            assert len(citations) == 1
            assert citations[0]["source_file"] == "f.pdf"

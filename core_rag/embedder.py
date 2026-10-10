"""
Local embedding client for Ollama's ``/api/embed`` endpoint.

Handles batching to keep memory use bounded and raises actionable
errors when Ollama is unreachable or the model is missing.
"""

from __future__ import annotations

import logging
from typing import Sequence

import httpx

logger = logging.getLogger(__name__)


class EmbeddingError(Exception):
    """Raised when the embedding request fails."""


def embed_texts(
    texts: Sequence[str],
    *,
    model: str,
    base_url: str,
    batch_size: int = 32,
    timeout: float = 120.0,
) -> list[list[float]]:
    """Generate embeddings for *texts* via Ollama in batches.

    Parameters
    ----------
    texts : sequence of str
        Texts to embed.
    model : str
        Ollama embedding model name.
    base_url : str
        Ollama base URL (e.g. ``http://localhost:11434``).
    batch_size : int
        Maximum texts per request.
    timeout : float
        HTTP timeout in seconds per request.

    Returns
    -------
    list[list[float]]
        One embedding vector per input text, in order.
    """
    if not texts:
        return []

    url = f"{base_url.rstrip('/')}/api/embed"
    all_embeddings: list[list[float]] = []

    for batch_start in range(0, len(texts), batch_size):
        batch = list(texts[batch_start: batch_start + batch_size])

        try:
            response = httpx.post(
                url,
                json={"model": model, "input": batch},
                timeout=timeout,
            )
        except httpx.ConnectError as exc:
            raise EmbeddingError(
                f"Cannot connect to Ollama at {base_url}. "
                f"Is Ollama running? Error: {exc}"
            ) from exc
        except httpx.TimeoutException as exc:
            raise EmbeddingError(
                f"Ollama embedding request timed out after {timeout}s: {exc}"
            ) from exc

        if response.status_code != 200:
            body = response.text[:500]
            raise EmbeddingError(
                f"Ollama embedding failed (HTTP {response.status_code}): {body}"
            )

        data = response.json()
        embeddings = data.get("embeddings")
        if not embeddings or len(embeddings) != len(batch):
            raise EmbeddingError(
                f"Unexpected embedding response: expected {len(batch)} "
                f"vectors, got {len(embeddings) if embeddings else 0}"
            )

        all_embeddings.extend(embeddings)

        logger.debug(
            "Embedded batch %d–%d of %d texts",
            batch_start, batch_start + len(batch), len(texts),
        )

    return all_embeddings


def embed_single(
    text: str,
    *,
    model: str,
    base_url: str,
    timeout: float = 120.0,
) -> list[float]:
    """Convenience wrapper: embed a single text string."""
    vecs = embed_texts(
        [text], model=model, base_url=base_url,
        batch_size=1, timeout=timeout,
    )
    return vecs[0]

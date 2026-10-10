"""
BM25 keyword retriever.

Builds a BM25 index over chunk texts, persists it as a pickle, and
supports querying by a tokenised query string.  The index is always
rebuilt from the current chunk corpus (full rebuild) so it stays
consistent with ChromaDB.
"""

from __future__ import annotations

import logging
import pickle
from dataclasses import dataclass
from pathlib import Path

from rank_bm25 import BM25Okapi

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class BM25Entry:
    """Lightweight reference stored alongside the BM25 index."""
    chunk_id: str
    source_file: str
    page_number: int
    text: str


def _tokenize(text: str) -> list[str]:
    """Simple whitespace + lowercase tokeniser."""
    return text.lower().split()


class BM25Index:
    """Wraps a ``BM25Okapi`` index with persistence and metadata."""

    def __init__(self) -> None:
        self._bm25: BM25Okapi | None = None
        self._entries: list[BM25Entry] = []

    # ------------------------------------------------------------------
    # Build
    # ------------------------------------------------------------------

    def build(self, entries: list[BM25Entry]) -> None:
        """Build the index from a list of entries.

        This replaces any existing index (full rebuild).
        """
        self._entries = list(entries)
        corpus = [_tokenize(e.text) for e in self._entries]
        self._bm25 = BM25Okapi(corpus)
        logger.info("Built BM25 index with %d entries", len(self._entries))

    # ------------------------------------------------------------------
    # Persist / Load
    # ------------------------------------------------------------------

    def save(self, path: Path) -> None:
        """Persist the index and entries to *path*."""
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "wb") as f:
            pickle.dump({"bm25": self._bm25, "entries": self._entries}, f)
        logger.info("Saved BM25 index to %s", path)

    def load(self, path: Path) -> None:
        """Load a previously saved index from *path*."""
        with open(path, "rb") as f:
            data = pickle.load(f)  # noqa: S301 – trusted local file
        self._bm25 = data["bm25"]
        self._entries = data["entries"]
        logger.info(
            "Loaded BM25 index (%d entries) from %s",
            len(self._entries), path,
        )

    # ------------------------------------------------------------------
    # Query
    # ------------------------------------------------------------------

    def query(self, question: str, top_k: int = 10) -> list[tuple[BM25Entry, float]]:
        """Return the top-K entries with BM25 scores for *question*.

        Returns a list of ``(entry, score)`` sorted descending by score.
        """
        if self._bm25 is None or not self._entries:
            return []

        tokens = _tokenize(question)
        if not tokens:
            return []

        scores = self._bm25.get_scores(tokens)
        scored = list(zip(self._entries, scores))
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    @property
    def size(self) -> int:
        return len(self._entries)

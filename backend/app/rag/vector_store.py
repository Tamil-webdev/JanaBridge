"""
ChromaDB persistent vector store for the BOOKMARK RAG pipeline.

Stores chunk embeddings with metadata (source file, page number, text).
Uses deterministic ``chunk_id`` values so re-indexing upserts cleanly.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Sequence

import chromadb

logger = logging.getLogger(__name__)

COLLECTION_NAME = "bookmark_chunks"


@dataclass(frozen=True)
class VectorResult:
    """A single result from a vector similarity query."""
    chunk_id: str
    source_file: str
    page_number: int
    text: str
    distance: float  # cosine distance (0 = identical)


class VectorStore:
    """Thin wrapper around a persistent ChromaDB collection."""

    def __init__(self, persist_dir: Path) -> None:
        persist_dir.mkdir(parents=True, exist_ok=True)
        self._client = chromadb.PersistentClient(path=str(persist_dir))
        self._collection = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )

    # ------------------------------------------------------------------
    # Mutation
    # ------------------------------------------------------------------

    def upsert(
        self,
        ids: Sequence[str],
        embeddings: Sequence[list[float]],
        metadatas: Sequence[dict],
        documents: Sequence[str],
    ) -> None:
        """Insert or update chunks by ID."""
        self._collection.upsert(
            ids=list(ids),
            embeddings=list(embeddings),
            metadatas=list(metadatas),
            documents=list(documents),
        )
        logger.info("Upserted %d chunks into ChromaDB", len(ids))

    def clear(self) -> None:
        """Delete the collection and recreate it (full rebuild)."""
        self._client.delete_collection(COLLECTION_NAME)
        self._collection = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
        logger.info("Cleared ChromaDB collection '%s'", COLLECTION_NAME)

    # ------------------------------------------------------------------
    # Query
    # ------------------------------------------------------------------

    def query(
        self,
        query_embedding: list[float],
        n_results: int = 10,
    ) -> list[VectorResult]:
        """Return the *n_results* nearest chunks to *query_embedding*."""
        count = self._collection.count()
        if count == 0:
            return []

        # Don't request more results than exist
        n = min(n_results, count)
        results = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=n,
            include=["metadatas", "documents", "distances"],
        )

        items: list[VectorResult] = []
        for i in range(len(results["ids"][0])):
            meta = results["metadatas"][0][i]
            items.append(VectorResult(
                chunk_id=results["ids"][0][i],
                source_file=meta["source_file"],
                page_number=int(meta["page_number"]),
                text=results["documents"][0][i],
                distance=results["distances"][0][i],
            ))
        return items

    @property
    def count(self) -> int:
        return self._collection.count()

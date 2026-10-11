"""
Pinecone vector store for the BOOKMARK RAG pipeline.

Stores chunk embeddings with metadata (source file, page number, text).
Uses deterministic ``chunk_id`` values so re-indexing upserts cleanly.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Sequence
import time

from pinecone import Pinecone, ServerlessSpec

logger = logging.getLogger(__name__)

@dataclass(frozen=True)
class VectorResult:
    """A single result from a vector similarity query."""
    chunk_id: str
    source_file: str
    page_number: int
    text: str
    distance: float  # cosine distance (0 = identical)


class VectorStore:
    """Thin wrapper around a Pinecone index."""

    def __init__(self, api_key: str, index_name: str) -> None:
        self.api_key = api_key
        self.index_name = index_name
        self.pc = Pinecone(api_key=api_key)
        self._index = None

    def _get_index(self, dimension: int = None):
        if self._index is not None:
            return self._index
            
        existing_indexes = [info["name"] for info in self.pc.list_indexes()]
        
        if self.index_name not in existing_indexes:
            if dimension is None:
                raise ValueError("Index does not exist and no dimension provided to create it.")
            logger.info("Creating Pinecone index '%s' with dimension %d", self.index_name, dimension)
            self.pc.create_index(
                name=self.index_name,
                dimension=dimension,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
            # Wait for index to be ready
            while not self.pc.describe_index(self.index_name).status['ready']:
                time.sleep(1)
            
        self._index = self.pc.Index(self.index_name)
        return self._index

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
        if not ids:
            return
            
        dimension = len(embeddings[0])
        index = self._get_index(dimension)
        
        vectors = []
        for i in range(len(ids)):
            meta = dict(metadatas[i]) if metadatas[i] else {}
            meta["text"] = documents[i]  # Pinecone metadata must hold the text
            vectors.append({
                "id": ids[i],
                "values": embeddings[i],
                "metadata": meta
            })
            
        # Upsert in batches of 100 to avoid Pinecone limits
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            index.upsert(vectors=vectors[i:i+batch_size])
            
        logger.info("Upserted %d chunks into Pinecone", len(ids))

    def clear(self) -> None:
        """Delete the collection and recreate it (full rebuild)."""
        existing_indexes = [info["name"] for info in self.pc.list_indexes()]
        if self.index_name in existing_indexes:
            self.pc.delete_index(self.index_name)
            logger.info("Cleared Pinecone index '%s'", self.index_name)
        self._index = None

    # ------------------------------------------------------------------
    # Query
    # ------------------------------------------------------------------

    def query(
        self,
        query_embedding: list[float],
        n_results: int = 10,
    ) -> list[VectorResult]:
        """Return the *n_results* nearest chunks to *query_embedding*."""
        try:
            index = self._get_index()
        except ValueError:
            return []
            
        results = index.query(
            vector=query_embedding,
            top_k=n_results,
            include_metadata=True
        )

        items: list[VectorResult] = []
        for match in results.matches:
            meta = match.metadata or {}
            items.append(VectorResult(
                chunk_id=match.id,
                source_file=meta.get("source_file", ""),
                page_number=int(meta.get("page_number", 0)),
                text=meta.get("text", ""),
                distance=1.0 - match.score,
            ))
        return items

    @property
    def count(self) -> int:
        try:
            index = self._get_index()
            stats = index.describe_index_stats()
            return stats.total_vector_count
        except ValueError:
            return 0

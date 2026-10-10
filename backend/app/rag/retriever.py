"""
Hybrid retriever combining semantic (ChromaDB) and keyword (BM25)
search via Reciprocal Rank Fusion (RRF).

Also implements a conservative relevance check to detect queries that
are likely unanswerable from the indexed corpus.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

from app.rag.bm25_retriever import BM25Index
from app.rag.vector_store import VectorResult, VectorStore

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class RetrievedChunk:
    """A chunk returned by the hybrid retriever."""
    chunk_id: str
    source_file: str
    page_number: int
    text: str
    rrf_score: float
    semantic_distance: float  # cosine distance from the query


def reciprocal_rank_fusion(
    ranked_lists: list[list[str]],
    k: int = 60,
) -> list[tuple[str, float]]:
    """Compute RRF scores across multiple ranked lists of IDs.

    Parameters
    ----------
    ranked_lists : list of lists of str
        Each inner list is a ranking (best first) of chunk IDs.
    k : int
        RRF constant.  Higher values dampen the effect of rank.

    Returns
    -------
    list of (chunk_id, rrf_score) sorted descending.
    """
    scores: dict[str, float] = {}
    for ranking in ranked_lists:
        for rank, chunk_id in enumerate(ranking, start=1):
            scores[chunk_id] = scores.get(chunk_id, 0.0) + 1.0 / (k + rank)

    fused = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return fused


def check_relevance(
    semantic_results: list[VectorResult],
    *,
    max_distance: float,
    min_fraction: float,
) -> bool:
    """Heuristic relevance gate.

    Returns ``True`` if a sufficient fraction of the semantic results
    fall within the distance threshold.

    These thresholds are *initial heuristics* — they should be tuned on
    real queries once evaluation data is available.

    Parameters
    ----------
    semantic_results : list[VectorResult]
        Results from the vector store, ordered by distance (ascending).
    max_distance : float
        Maximum cosine distance for a result to count as "relevant".
    min_fraction : float
        Minimum fraction of results that must be relevant.
    """
    if not semantic_results:
        return False

    relevant_count = sum(
        1 for r in semantic_results if r.distance <= max_distance
    )
    fraction = relevant_count / len(semantic_results)
    logger.debug(
        "Relevance check: %d/%d (%.1f%%) within distance %.3f "
        "(need %.0f%%)",
        relevant_count, len(semantic_results), fraction * 100,
        max_distance, min_fraction * 100,
    )
    return fraction >= min_fraction


def hybrid_retrieve(
    query_embedding: list[float],
    question: str,
    *,
    vector_store: VectorStore,
    bm25_index: BM25Index,
    top_k_semantic: int = 10,
    top_k_bm25: int = 10,
    top_k_final: int = 5,
    rrf_k: int = 60,
    max_semantic_distance: float = 1.4,
    min_relevant_fraction: float = 0.2,
) -> tuple[list[RetrievedChunk], bool]:
    """Run hybrid retrieval and return (chunks, is_relevant).

    Parameters
    ----------
    query_embedding : list[float]
        Embedding of the user's question.
    question : str
        Raw question text for BM25.
    vector_store, bm25_index
        The two retrieval backends.
    top_k_semantic, top_k_bm25
        How many results to pull from each backend.
    top_k_final
        How many fused results to return.
    rrf_k
        RRF constant.
    max_semantic_distance, min_relevant_fraction
        Relevance-gate heuristic parameters.

    Returns
    -------
    (list[RetrievedChunk], is_relevant)
        ``is_relevant`` is ``False`` when the evidence is likely
        insufficient to answer the question.
    """
    # 1. Semantic retrieval
    sem_results = vector_store.query(query_embedding, n_results=top_k_semantic)

    # 2. Relevance gate
    is_relevant = check_relevance(
        sem_results,
        max_distance=max_semantic_distance,
        min_fraction=min_relevant_fraction,
    )

    # 3. BM25 retrieval
    bm25_results = bm25_index.query(question, top_k=top_k_bm25)

    # 4. RRF fusion
    sem_ids = [r.chunk_id for r in sem_results]
    bm25_ids = [entry.chunk_id for entry, _score in bm25_results]

    fused = reciprocal_rank_fusion([sem_ids, bm25_ids], k=rrf_k)

    # Build lookup tables
    all_chunks: dict[str, dict] = {}
    for r in sem_results:
        all_chunks[r.chunk_id] = {
            "source_file": r.source_file,
            "page_number": r.page_number,
            "text": r.text,
            "semantic_distance": r.distance,
        }
    for entry, _score in bm25_results:
        if entry.chunk_id not in all_chunks:
            all_chunks[entry.chunk_id] = {
                "source_file": entry.source_file,
                "page_number": entry.page_number,
                "text": entry.text,
                "semantic_distance": float("inf"),  # not from semantic search
            }

    # 5. Assemble top-K fused chunks
    results: list[RetrievedChunk] = []
    for chunk_id, rrf_score in fused[:top_k_final]:
        if chunk_id not in all_chunks:
            continue
        info = all_chunks[chunk_id]
        results.append(RetrievedChunk(
            chunk_id=chunk_id,
            source_file=info["source_file"],
            page_number=info["page_number"],
            text=info["text"],
            rrf_score=rrf_score,
            semantic_distance=info["semantic_distance"],
        ))

    logger.info(
        "Hybrid retrieval: %d semantic, %d BM25 → %d fused (relevant=%s)",
        len(sem_results), len(bm25_results), len(results), is_relevant,
    )
    return results, is_relevant

"""Tests for Reciprocal Rank Fusion scoring."""

from __future__ import annotations

from core_rag.retriever import reciprocal_rank_fusion


class TestRRF:
    def test_single_list(self) -> None:
        fused = reciprocal_rank_fusion([["a", "b", "c"]], k=60)
        ids = [x[0] for x in fused]
        assert ids == ["a", "b", "c"]

    def test_scores_decrease_with_rank(self) -> None:
        fused = reciprocal_rank_fusion([["a", "b", "c"]], k=60)
        scores = [x[1] for x in fused]
        assert scores[0] > scores[1] > scores[2]

    def test_item_in_both_lists_ranks_higher(self) -> None:
        """An item appearing in both lists should score higher than
        items appearing in only one."""
        list1 = ["a", "b", "c"]
        list2 = ["c", "d", "a"]
        fused = reciprocal_rank_fusion([list1, list2], k=60)
        scores = dict(fused)

        # 'a' appears in both (rank 1 + rank 3)
        # 'b' appears only in list1 (rank 2)
        # 'c' appears in both (rank 3 + rank 1)
        # 'd' appears only in list2 (rank 2)
        assert scores["a"] > scores["b"]
        assert scores["c"] > scores["d"]
        # 'a' and 'c' have symmetric scores
        assert abs(scores["a"] - scores["c"]) < 1e-10

    def test_k_parameter_affects_scores(self) -> None:
        fused_low_k = reciprocal_rank_fusion([["a", "b"]], k=1)
        fused_high_k = reciprocal_rank_fusion([["a", "b"]], k=100)
        # With low k, scores are higher and the gap is wider
        low_scores = dict(fused_low_k)
        high_scores = dict(fused_high_k)
        gap_low = low_scores["a"] - low_scores["b"]
        gap_high = high_scores["a"] - high_scores["b"]
        assert gap_low > gap_high

    def test_empty_lists(self) -> None:
        assert reciprocal_rank_fusion([[], []], k=60) == []

    def test_no_lists(self) -> None:
        assert reciprocal_rank_fusion([], k=60) == []

    def test_disjoint_lists(self) -> None:
        fused = reciprocal_rank_fusion([["a", "b"], ["c", "d"]], k=60)
        ids = {x[0] for x in fused}
        assert ids == {"a", "b", "c", "d"}

    def test_rrf_formula_exact_values(self) -> None:
        """Verify the exact RRF score for a known case."""
        fused = reciprocal_rank_fusion([["x"]], k=60)
        # score = 1 / (60 + 1) = 1/61
        assert abs(fused[0][1] - 1 / 61) < 1e-10

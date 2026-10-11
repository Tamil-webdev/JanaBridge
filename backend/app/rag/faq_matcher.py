import json
import re
from pathlib import Path
from thefuzz import process, fuzz
import numpy as np

from app.rag.embedder import embed_single, embed_texts
from app.rag.config import Settings

FAQ_FILE = Path(__file__).parent.parent / "data" / "janabridge_faq.json"

class FAQMatcher:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.faqs = []
        self.variations_map = {} # variation -> faq_dict
        self.variations_list = []
        self.embeddings_list = []
        
        self.load_faqs()

    def load_faqs(self):
        if not FAQ_FILE.exists():
            return
            
        with open(FAQ_FILE, 'r', encoding='utf-8') as f:
            self.faqs = json.load(f)
            
        for faq in self.faqs:
            # Add exact question
            q = self.normalize(faq["question"])
            self.variations_map[q] = faq
            self.variations_list.append(q)
            
            # Add variations
            for var in faq.get("variations", []):
                var_norm = self.normalize(var)
                self.variations_map[var_norm] = faq
                self.variations_list.append(var_norm)

        # Pre-embed variations for semantic search
        if self.variations_list:
            self.embeddings_list = embed_texts(
                self.variations_list,
                model=self.settings.embedding_model,
                base_url=self.settings.ollama_base_url,
                batch_size=self.settings.embedding_batch_size,
                timeout=self.settings.ollama_timeout,
            )

    def normalize(self, text: str) -> str:
        # Normalize case, extra spaces, punctuation
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def match(self, question: str):
        if not self.faqs:
            return None
            
        q_norm = self.normalize(question)
        if not q_norm:
            return None
            
        # 1. Fuzzy Matching
        best_match = process.extractOne(q_norm, self.variations_list, scorer=fuzz.token_set_ratio)
        if best_match and best_match[1] >= 85: # High confidence fuzzy match
            matched_var = best_match[0]
            return self.variations_map[matched_var]
            
        # 2. Semantic Similarity
        q_emb = embed_single(
            q_norm,
            model=self.settings.embedding_model,
            base_url=self.settings.ollama_base_url,
            timeout=self.settings.ollama_timeout,
        )
        
        # Calculate cosine similarities
        import math
        similarities = []
        for emb in self.embeddings_list:
            dot = sum(a * b for a, b in zip(q_emb, emb))
            norm_a = math.sqrt(sum(a * a for a in q_emb))
            norm_b = math.sqrt(sum(b * b for b in emb))
            sim = dot / (norm_a * norm_b) if norm_a and norm_b else 0
            similarities.append(sim)
            
        # Get top 2
        top_indices = np.argsort(similarities)[-2:][::-1]
        best_idx = top_indices[0]
        best_sim = similarities[best_idx]
        
        if len(top_indices) > 1:
            second_idx = top_indices[1]
            second_sim = similarities[second_idx]
            margin = best_sim - second_sim
        else:
            margin = 1.0

        # Conservative threshold and margin
        if best_sim > 0.82 and margin > 0.05:
            matched_var = self.variations_list[best_idx]
            return self.variations_map[matched_var]
            
        return None

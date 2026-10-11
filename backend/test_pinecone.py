"""
End-to-End RAG test script.

Tests retrieval of various schemes from Pinecone + answer generation using Ollama.
Includes 15+ comprehensive evaluation scenarios.
"""

import sys
import logging
import asyncio
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import settings
from app.rag.rag_pipeline import RAGPipeline

logging.basicConfig(level=logging.WARNING)

async def test_retrieval():
    print(f"\n--- Testing JanaBridge RAG Pipeline ---")
    print(f"Index: {settings.pinecone_index_name}")
    print(f"Embeddings: {settings.embedding_model}")
    print(f"Generation: {settings.generation_model}\n")
    
    pipeline = RAGPipeline(settings)
    
    print(f"Vector Store count: {pipeline._vector_store.count}")
    print(f"BM25 entries: {len(pipeline._bm25_index._entries)}")
    
    questions = [
        # Certificate Services (Synthetic 1)
        "What is the application fee and timeline for a Community Certificate?",
        "First graduate certificate vaanga enna documents venum?",
        "En annan already college padikran, can I get first graduate?",
        "What documents are needed for an Income Certificate?",
        
        # Student Welfare (Synthetic 2)
        "What are the benefits of the Pudhumai Penn Scheme?",
        "Does the Pudhumai Penn scheme apply to postgraduate (PG) students?",
        "Pudhumai Penn scheme ku eppadi apply pandrathu?",
        
        # Ambiguous / Missing info (Synthetic 2 / 5)
        "How much is the fellowship amount for Dr. Radhakrishnan Post Doctoral Fellowship?",
        
        # Pension Schemes (Synthetic 3)
        "Who is eligible for the Indira Gandhi National Old Age Pension Scheme (IGNOAPS)?",
        "Will I get the widow pension if my son is earning well?",
        
        # Application Guidelines (Synthetic 4)
        "What is the maximum file size for document uploads?",
        "Do I always need a Notary Affidavit, or is a Self-Declaration enough?",
        
        # Multi-part / Cross-document (Synthetic 5)
        "I need to apply for an Income Certificate and I also want to know the documents for the Destitute Widow Pension.",
        
        # Rejected / Insufficient Evidence (Synthetic 5)
        "How do I apply for the Space Tourism Subsidy to Mars?",
        "What is the cost of the Hyperloop Connectivity Pass between Chennai and Madurai?"
    ]
    
    for i, q in enumerate(questions, 1):
        print(f"\n=== Q{i}: {q} ===")
        res = pipeline.query(q)
        print(f"Status: {res.status}")
        print(f"Answer: {res.answer[:150]}..." if len(res.answer) > 150 else f"Answer: {res.answer}")
        
        if res.citations:
            unique_sources = list(set(f"{c.get('source_file')}" for c in res.citations))
            print(f"Sources cited: {', '.join(unique_sources)}")
        else:
            print("Sources cited: None")

if __name__ == "__main__":
    asyncio.run(test_retrieval())

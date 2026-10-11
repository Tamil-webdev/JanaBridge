"""
Parse the e-Sevai services catalogue (TSV) and index each service
as a structured text chunk into Pinecone via the existing RAG pipeline.

Each service becomes one chunk with all fields preserved:
department, service name, fees, required documents, timeline, application URL.
"""

import csv
import hashlib
import json
import logging
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# Add parent to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import settings
from app.rag.embedder import embed_texts
from app.rag.vector_store import VectorStore
from app.rag.bm25_retriever import BM25Entry, BM25Index

TSV_PATH = Path(__file__).parent / "data" / "esevai_services.tsv"
BM25_PATH = settings.bm25_path


def parse_catalogue(tsv_path: Path) -> list[dict]:
    """Parse TSV catalogue into structured records."""
    records = []
    seen_keys = set()

    with open(tsv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            sno = row.get("S.No", "").strip()
            dept = row.get("Department", "").strip()
            service = row.get("Service name", "").strip()

            if not service or not dept:
                continue

            # Deduplicate (e.g. S.No 217 and 218 are identical)
            dedup_key = f"{dept}||{service}"
            if dedup_key in seen_keys:
                logger.warning("DUPLICATE skipped: S.No %s — %s", sno, service)
                continue
            seen_keys.add(dedup_key)

            # Parse fees — represent "NA" and missing as "unknown"
            app_fee = (row.get("Application Fee") or row.get("Fee") or "").strip()
            svc_charge = (row.get("Service Charge") or "").strip()
            if not app_fee or app_fee.upper() == "NA":
                app_fee = "unknown"
            if not svc_charge or svc_charge.upper() == "NA":
                svc_charge = "unknown"

            # Parse documents
            docs_raw = (row.get("List of Document Required") or "").strip()
            if not docs_raw or docs_raw.upper() == "NA":
                docs_required = "unknown"
            else:
                docs_required = docs_raw.replace("\\n", "\n")

            # Parse timeline
            timeline = (row.get("Stipulated Timeline") or "").strip()
            if not timeline or timeline == "-":
                timeline = "unknown"

            # Application URL
            apply_url = (row.get("link to apply") or "").strip()
            if not apply_url:
                apply_url = "https://www.tnesevai.tn.gov.in/"

            records.append({
                "sno": sno,
                "department": dept,
                "service_name": service,
                "application_fee": app_fee,
                "service_charge": svc_charge,
                "timeline": timeline,
                "documents_required": docs_required,
                "application_url": apply_url,
            })

    return records


def record_to_text(rec: dict) -> str:
    """Format a service record as retrievable text."""
    lines = [
        f"Tamil Nadu e-Sevai Service: {rec['service_name']}",
        f"Department: {rec['department']}",
        f"Application Fee: {rec['application_fee']}",
        f"Service Charge: {rec['service_charge']}",
        f"Stipulated Timeline: {rec['timeline']}",
        f"Required Documents: {rec['documents_required']}",
        f"Apply at: {rec['application_url']}",
        "",
        "Source: Tamil Nadu e-Sevai Services Catalogue (https://www.tnesevai.tn.gov.in/Pages/ServiceList.aspx)",
        "Note: This information is from the e-Sevai catalogue. Verify current details with the responsible official department.",
    ]
    return "\n".join(lines)


def make_chunk_id(rec: dict) -> str:
    """Deterministic ID for a catalogue service record."""
    key = f"esevai::{rec['department']}::{rec['service_name']}"
    return "esv-" + hashlib.sha256(key.encode("utf-8")).hexdigest()[:14]


def main():
    logger.info("Parsing catalogue from %s", TSV_PATH)
    records = parse_catalogue(TSV_PATH)
    logger.info("Parsed %d unique service records", len(records))

    if not records:
        logger.error("No records parsed!")
        return

    # Build text chunks
    texts = [record_to_text(r) for r in records]
    ids = [make_chunk_id(r) for r in records]
    metadatas = [
        {
            "source_file": "esevai_services_catalogue.tsv",
            "page_number": int(r["sno"]) if r["sno"].isdigit() else 0,
            "chunk_index": i,
            "department": r["department"],
            "service_name": r["service_name"],
            "source_type": "catalogue",
        }
        for i, r in enumerate(records)
    ]

    # Embed all texts
    logger.info("Embedding %d service records...", len(texts))
    embeddings = embed_texts(
        texts,
        model=settings.embedding_model,
        base_url=settings.ollama_base_url,
        batch_size=settings.embedding_batch_size,
        timeout=settings.ollama_timeout,
    )
    logger.info("Got %d embeddings, dimension=%d", len(embeddings), len(embeddings[0]))

    # Upsert to Pinecone
    vs = VectorStore(
        api_key=settings.pinecone_api_key,
        index_name=settings.pinecone_index_name,
    )
    vs.upsert(ids, embeddings, metadatas, texts)
    logger.info("Upserted %d catalogue vectors to Pinecone", len(ids))

    # Update BM25 index — load existing, add new entries, save
    bm25 = BM25Index()
    if BM25_PATH.exists():
        try:
            bm25.load(BM25_PATH)
            logger.info("Loaded existing BM25 index with %d entries", len(bm25._entries))
        except Exception:
            logger.warning("Could not load BM25; rebuilding from catalogue only")

    new_entries = [
        BM25Entry(
            chunk_id=ids[i],
            source_file="esevai_services_catalogue.tsv",
            page_number=int(records[i]["sno"]) if records[i]["sno"].isdigit() else 0,
            text=texts[i],
        )
        for i in range(len(records))
    ]

    # Merge: keep existing non-catalogue entries + add catalogue entries
    existing_non_catalogue = [
        e for e in bm25._entries
        if not e.chunk_id.startswith("esv-")
    ]
    all_entries = existing_non_catalogue + new_entries
    bm25.build(all_entries)
    bm25.save(BM25_PATH)
    logger.info("BM25 index updated: %d total entries", len(all_entries))

    # Stats
    stats = {
        "records_parsed": len(records),
        "records_embedded": len(embeddings),
        "records_upserted": len(ids),
        "embedding_dimension": len(embeddings[0]),
        "bm25_total_entries": len(all_entries),
    }
    print(f"\n=== Catalogue indexing complete ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()

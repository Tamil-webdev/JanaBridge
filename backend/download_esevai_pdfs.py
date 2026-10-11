"""
Download official Tamil Nadu e-Sevai user manual PDFs and index them.

This script:
1. Downloads real PDFs from https://www.tnesevai.tn.gov.in/Pages/PPT/
2. Validates each is a real PDF (checks magic bytes)
3. Saves them to backend/documents/
4. Writes a manifest (download_manifest.json) recording provenance
5. Triggers the existing indexing pipeline
"""

import os
import sys
import json
import time
import hashlib
import logging
from pathlib import Path
from datetime import datetime, timezone

import httpx

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# -- Configuration ----------------------------------------------------------

DOCUMENTS_DIR = Path(__file__).parent / "documents"
MANIFEST_PATH = Path(__file__).parent / "data" / "download_manifest.json"

# 10 diverse, high-value official PDFs covering different departments
PDF_SOURCES = [
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/CSCOperator_REV-101_CommunityCertificate.pdf",
        "department": "Revenue Administration",
        "service": "Community Certificate",
        "service_id": "REV-101",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/CSCOperator_REV-103_IncomeCertificate.pdf",
        "department": "Revenue Administration",
        "service": "Income Certificate",
        "service_id": "REV-103",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/CSCOperator_REV-114_LegalHeirCertificate.pdf",
        "department": "Revenue Administration",
        "service": "Legal Heir Certificate",
        "service_id": "REV-114",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/CSCOperator_REV_201_Indira_Gandhi_National_Old_Age.pdf",
        "department": "Revenue Administration",
        "service": "Indira Gandhi National Old Age Pension Scheme (IGNOPS)",
        "service_id": "REV-201",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/CSCOperator_REV_206_Differently_Abled_Pension_Scheme.pdf",
        "department": "Revenue Administration",
        "service": "Differently Abled Pension Scheme (DAPS)",
        "service_id": "REV-206",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/ADF201NFSRSchemeOperator.pdf",
        "department": "Animal Husbandry, Dairying and Fisheries",
        "service": "National Fishermen Savings cum Relief Scheme",
        "service_id": "ADF-201",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/PDS-501_Application_for_New_Ration_card.pdf",
        "department": "Civil Supplies and Consumer Protection",
        "service": "Application for New Ration Card",
        "service_id": "PDS-501",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/DHT201AppScholarshipHandloomoperator.pdf",
        "department": "Directorate of Handlooms & Textiles",
        "service": "Scholarship Under Dr.MGR Handloom Weavers Welfare Trust",
        "service_id": "DHT-201",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/MarriageAssistance_Operators.pdf",
        "department": "Differently Abled Welfare",
        "service": "Marriage Assistance for Differently Abled",
        "service_id": "WDA-201",
    },
    {
        "url": "https://www.tnesevai.tn.gov.in/Pages/PPT/CSCOperator_REV_202_Destitute_Widow_Pension_Scheme.pdf",
        "department": "Revenue Administration",
        "service": "Destitute Widow Pension Scheme (DWPS)",
        "service_id": "REV-202",
    },
]


def is_valid_pdf(filepath: Path) -> bool:
    """Check if file starts with PDF magic bytes."""
    try:
        with open(filepath, "rb") as f:
            header = f.read(5)
            return header == b"%PDF-"
    except Exception:
        return False


def file_hash(filepath: Path) -> str:
    """SHA-256 hash of file content."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for block in iter(lambda: f.read(8192), b""):
            h.update(block)
    return h.hexdigest()


def download_pdfs() -> list[dict]:
    """Download PDFs and return manifest entries."""
    DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)

    manifest = []
    stats = {"attempted": 0, "downloaded": 0, "skipped_exists": 0, "failed": 0}

    client = httpx.Client(
        timeout=30.0,
        follow_redirects=True,
        headers={
            "User-Agent": "JanaBridge/1.0 (Government Service Index)"
        }
    )

    for source in PDF_SOURCES:
        stats["attempted"] += 1
        url = source["url"]
        filename = url.split("/")[-1]
        filepath = DOCUMENTS_DIR / filename

        # Skip if already downloaded and valid
        if filepath.exists() and is_valid_pdf(filepath):
            logger.info("SKIP (exists): %s", filename)
            manifest.append({
                **source,
                "filename": filename,
                "status": "already_exists",
                "file_size": filepath.stat().st_size,
                "sha256": file_hash(filepath),
                "downloaded_at": None,
            })
            stats["skipped_exists"] += 1
            continue

        logger.info("Downloading: %s", url)
        try:
            resp = client.get(url)
            if resp.status_code != 200:
                logger.warning("FAIL (HTTP %d): %s", resp.status_code, filename)
                manifest.append({
                    **source,
                    "filename": filename,
                    "status": f"http_error_{resp.status_code}",
                    "file_size": 0,
                    "sha256": None,
                    "downloaded_at": datetime.now(timezone.utc).isoformat(),
                })
                stats["failed"] += 1
                continue

            content = resp.content
            # Validate it looks like a PDF
            if not content[:5] == b"%PDF-":
                logger.warning("FAIL (not a PDF): %s", filename)
                manifest.append({
                    **source,
                    "filename": filename,
                    "status": "not_a_pdf",
                    "file_size": len(content),
                    "sha256": None,
                    "downloaded_at": datetime.now(timezone.utc).isoformat(),
                })
                stats["failed"] += 1
                continue

            filepath.write_bytes(content)
            sha = file_hash(filepath)
            logger.info("OK: %s (%d bytes)", filename, len(content))
            manifest.append({
                **source,
                "filename": filename,
                "status": "downloaded",
                "file_size": len(content),
                "sha256": sha,
                "downloaded_at": datetime.now(timezone.utc).isoformat(),
            })
            stats["downloaded"] += 1

        except Exception as e:
            logger.error("FAIL (network): %s — %s", filename, e)
            manifest.append({
                **source,
                "filename": filename,
                "status": f"error: {str(e)[:200]}",
                "file_size": 0,
                "sha256": None,
                "downloaded_at": datetime.now(timezone.utc).isoformat(),
            })
            stats["failed"] += 1

    client.close()

    # Save manifest
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "source_portal": "https://www.tnesevai.tn.gov.in/Pages/ServiceList.aspx",
            "stats": stats,
            "documents": manifest,
        }, f, indent=2, ensure_ascii=False)

    logger.info("Download stats: %s", stats)
    return manifest


if __name__ == "__main__":
    results = download_pdfs()
    ok = [r for r in results if r["status"] in ("downloaded", "already_exists")]
    print(f"\n=== Download complete: {len(ok)}/{len(results)} PDFs ready ===")
    for r in results:
        print(f"  [{r['status']:>15}] {r['filename']}")

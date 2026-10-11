"""
Language detection module for JanaBridge.
Detects English, Tamil script, Hindi (Devanagari) script, and Tanglish (Tamil in Latin script).
"""

import re
from typing import Literal

SupportedLanguage = Literal["english", "tanglish", "tamil", "hindi"]

# Unicode character ranges
TAMIL_PATTERN = re.compile(r"[\u0B80-\u0BFF]")
HINDI_PATTERN = re.compile(r"[\u0900-\u097F]")

# Tanglish keyword and suffix markers (Tamil words written in Latin script)
TANGLISH_WORDS = {
    # Question words / Interrogatives
    "epdi", "eppadi", "eppdi", "enna", "engu", "enga", "eppo", "eppo", "yaar", "yaaru", "yaarukku", "edhu", "ethu",
    # Verbs / Actions
    "panradhu", "panrathu", "pannunga", "pannanum", "panna", "pannalam", "pannikalam",
    "ponga", "vaanga", "solunga", "sollunga", "kudunga", "kudukalam", "kudukka",
    "edukuradhu", "edukanum", "edukka", "eduthu", "eduthukonga",
    "paakanum", "paarkalam", "parunga",
    "mudiyuma", "mudiyum", "mudiyaadhu",
    "theriyum", "theriyuma", "therila",
    "irukku", "irukka", "irundha", "iruntha",
    "seivathu", "seiyanum", "seiya",
    "kedaikkum", "kedaikuma", "kedaikkuma", "kedaikadhu",
    "aagum", "aayiduchu", "aachu",
    "submit", "apply", "upload", # often combined with tanglish words
    # Common Tanglish words
    "venum", "vendam", "vendaam", "thevai", "thevaiya",
    "enakku", "unakku", "ungallukku", "ungalukku", "avanga", "avangalukku",
    "adhu", "idhu", "adhellam", "idhellam",
    "la", "ku", "oda", "kooda", "mattum",
    "nalla", "romba", "chinna", "periya",
    "illai", "illa", "illaiya",
    "dhan", "than", "aprom", "marubadiyum",
    # Administrative & scheme Tamil words in Latin script
    "varumana", "saanrithal", "sandrithal", "saandrithal",
    "vinnappam", "vinnappikka", "vinnappippathu",
    "saathi", "iruppida", "kudumba", "attai",
    "magalir", "urimai", "thogai", "muthiyor", "oivu", "oothiyam",
    "patta", "chitta", "esevai", "tnesevai"
}

# Regex for common Tanglish verb and case suffixes
TANGLISH_SUFFIX_PATTERN = re.compile(
    r"\b\w+(panradhu|panrathu|pannunga|pannanum|pannalam|edukkurathu|edukuradhu|edukanum|venum|kaga|ku|la)\b",
    re.IGNORECASE
)


def detect_language(text: str, fallback: SupportedLanguage = "english") -> SupportedLanguage:
    """
    Detect language of input text:
    - 'tamil': Contains Tamil script characters (\u0B80-\u0BFF)
    - 'hindi': Contains Devanagari script characters (\u0900-\u097F)
    - 'tanglish': Written in Latin script with distinctive Tamil words/suffixes
    - 'english': Standard Latin script English
    """
    if not text or not text.strip():
        return fallback

    cleaned = text.strip()

    # 1. Check for Tamil script
    if TAMIL_PATTERN.search(cleaned):
        return "tamil"

    # 2. Check for Hindi / Devanagari script
    if HINDI_PATTERN.search(cleaned):
        return "hindi"

    # 3. Analyze Latin text for Tanglish vs English
    # Lowercase and clean punctuation
    words = re.findall(r"\b[a-zA-Z]+(?:-[a-zA-Z]+)?\b", cleaned.lower())
    if not words:
        return fallback

    tanglish_matches = 0
    strong_tanglish_hit = False

    # Words that definitively indicate Tanglish
    strong_markers = {
        "epdi", "eppadi", "eppdi", "panradhu", "panrathu", "pannunga", "pannanum",
        "venum", "edukuradhu", "edukanum", "mudiyuma", "kedaikkum", "kedaikuma",
        "vinnappam", "saanrithal", "sandrithal", "saandrithal", "vinnappippathu",
        "iruppida", "saathi", "muthiyor", "oivu", "oothiyam", "aayiduchu",
        "solunga", "sollunga", "kudunga", "seivathu", "seiyanum"
    }

    for w in words:
        if w in strong_markers:
            strong_tanglish_hit = True
            tanglish_matches += 2
        elif w in TANGLISH_WORDS:
            tanglish_matches += 1
        elif TANGLISH_SUFFIX_PATTERN.match(w):
            strong_tanglish_hit = True
            tanglish_matches += 1

    if strong_tanglish_hit or tanglish_matches >= 2:
        return "tanglish"

    # Single match if short sentence (e.g., "CAN na enna?")
    if len(words) <= 4 and tanglish_matches >= 1:
        return "tanglish"

    return "english"

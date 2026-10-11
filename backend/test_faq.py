import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.rag.faq import faq_system

def run_tests():
    test_cases = [
        # 10 Intents + Tanglish variations + voice transcripts (which may have slight errors)
        ("income certificate epdi apply panradhu", True),
        ("enakku varumana saanrithal venum", True),
        ("how to apply for income certificate", True),
        ("community certificate ku enna documents venum", True),
        ("nativity certificate eppadi edukkurathu", True),
        ("CAN na enna", True),
        ("what is can number", True),
        ("application status epdi check panradhu", True),
        ("certificate reject aayiduchu enna panradhu", True),
        ("magalir urimai thogai ku epdi apply panrathu", True),
        ("ration card apply panradhu eppadi", True),
        ("patta chitta epdi check panradhu", True),
        ("pension scheme ku epdi apply panrathu", True),
        
        # Unrelated / Low confidence
        ("who won the cricket match yesterday", False),
        ("what is the capital of france", False),
        ("how to cook biryani", False),
    ]

    print("Running intent tests...")
    for q, expected in test_cases:
        res = faq_system.match(q, [])
        matched = res is not None
        if matched == expected:
            print(f"[PASS] '{q}' -> Matched: {matched}")
        else:
            print(f"[FAIL] '{q}' -> Expected {expected}, got {matched}")
            if res:
                print(f"       Matched Answer: {res.answer}")

    print("\nRunning follow-up context tests...")
    history = [{"role": "assistant", "content": "You can get an income certificate from the e-Sevai centre."}]
    res = faq_system.match("what documents are needed", history)
    if res:
        print(f"[PASS] Context follow-up matched: {res.answer[:50]}...")
    else:
        print("[FAIL] Context follow-up did not match.")
        
    history2 = [{"role": "assistant", "content": "To apply for community certificate, you need documents."}]
    res2 = faq_system.match("how do i apply for this", history2)
    if res2:
        print(f"[PASS] Context follow-up 2 matched: {res2.answer[:50]}...")
    else:
        print("[FAIL] Context follow-up 2 did not match.")

if __name__ == "__main__":
    run_tests()

"""
run_recommendation.py
CLI wrapper to execute get_full_recommendation directly and print JSON to stdout.
Never blocks on stdin.
"""

import sys
import json
import argparse
from pathlib import Path

# Fix Windows console encoding
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from app.models.mrl_validator import MRLDatabase, MRLValidator
from app.models.recommendation_engine import get_full_recommendation

def load_database():
    candidate_paths = [
        Path("data/mrl_australia_table1.json"),
        Path("mrl_australia_table1.json"),
        Path(__file__).resolve().parent / "data" / "mrl_australia_table1.json",
        Path(__file__).resolve().parent / "mrl_australia_table1.json",
        Path(__file__).resolve().parent.parent / "data" / "mrl_australia_table1.json",
    ]
    for p in candidate_paths:
        if p.exists():
            return MRLDatabase.from_json_file(p)
    raise FileNotFoundError("mrl_australia_table1.json not found in candidate paths")

def main():
    parser = argparse.ArgumentParser(description="MRL & Fertilizer Recommendation CLI")
    parser.add_argument("--crop", default=None, help="Crop name (e.g. Avocado, Tomatoes)")
    parser.add_argument("--issue", default=None, help="Target pest/disease (e.g. mites, aphids)")
    parser.add_argument("--soil", default=None, help="JSON string for soil test metrics")
    parser.add_argument("--payload", default=None, help="Full JSON payload string")
    parser.add_argument("pos_crop", nargs="?", default=None, help="Positional crop")
    parser.add_argument("pos_issue", nargs="?", default=None, help="Positional issue")
    parser.add_argument("pos_soil", nargs="?", default=None, help="Positional soil JSON")

    args = parser.parse_args()

    crop = args.crop or args.pos_crop or "Avocado"
    issue = args.issue or args.pos_issue or "mites"
    soil_test = None

    if args.payload:
        try:
            p_data = json.loads(args.payload)
            crop = p_data.get("crop", crop)
            issue = p_data.get("issue") or p_data.get("target_issue", issue)
            soil_test = p_data.get("soil_test", soil_test)
        except Exception:
            pass

    soil_str = args.soil or args.pos_soil
    if soil_str and not soil_test:
        try:
            soil_test = json.loads(soil_str)
        except Exception:
            soil_test = None

    try:
        db = load_database()
        validator = MRLValidator(db)
        result = get_full_recommendation(
            crop=crop,
            soil_test=soil_test,
            target_issue=issue,
            validator=validator
        )
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "error": str(e),
            "crop": crop,
            "fertilizer_recommendations": [],
            "pesticide_recommendations": {"safe": [], "flagged_warnings": []}
        }, indent=2))

if __name__ == "__main__":
    main()

"""
mrl_validator.py

MRL lookup + compliance validation layer for the FarmFlow / AgroSmart recommendation engine.
Assumes the Australian APVMA MRL Standard dataset schema.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from difflib import get_close_matches
from enum import Enum
from pathlib import Path
from typing import Optional

logger = logging.getLogger("farmflow.mrl_validator")

FIELD_MAP = {
    "compound": "compound",
    "commodity": "food_commodity",
    "mrl_value": "mrl_value_mg_per_kg",
    "mrl_flags": "mrl_flags",
}


class ValidationStatus(str, Enum):
    COMPLIANT = "COMPLIANT"                # estimated/expected residue is within the legal MRL
    EXCEEDS_MRL = "EXCEEDS_MRL"            # estimated/expected residue is above the legal MRL — must not recommend
    NO_MRL_FOUND = "NO_MRL_FOUND"          # compound has no registered MRL for this crop — treat as not approved
    NEEDS_RESIDUE_ESTIMATE = "NEEDS_RESIDUE_ESTIMATE"  # MRL exists, but no residue value was supplied to compare


@dataclass
class MRLRecord:
    compound: str
    commodity: str
    mrl_value_mg_per_kg: Optional[float]
    mrl_flags: str = ""

    @property
    def is_temporary(self) -> bool:
        return "T" in (self.mrl_flags or "")

    @property
    def is_at_quantitation_limit(self) -> bool:
        return "*" in (self.mrl_flags or "")


@dataclass
class ValidationResult:
    compound: str
    crop: str
    status: ValidationStatus
    mrl_limit_mg_per_kg: Optional[float] = None
    estimated_residue_mg_per_kg: Optional[float] = None
    matched_commodity: Optional[str] = None
    message: str = ""

    @property
    def is_safe_to_recommend(self) -> bool:
        """The single boolean the recommendation engine should gate on."""
        return self.status == ValidationStatus.COMPLIANT


class MRLDatabase:
    """
    Loads the MRL dataset and answers: 'does compound X have a legal
    residue limit for crop Y, and what is it?'
    """

    def __init__(self, records: list[MRLRecord]):
        self._by_compound_commodity: dict[tuple[str, str], MRLRecord] = {}
        self._commodities_by_compound: dict[str, list[str]] = {}
        self._all_commodities: set[str] = set()

        for r in records:
            key = (r.compound.strip().lower(), r.commodity.strip().lower())
            self._by_compound_commodity[key] = r
            self._commodities_by_compound.setdefault(r.compound.strip().lower(), []).append(r.commodity)
            self._all_commodities.add(r.commodity)

        logger.info(
            "MRLDatabase loaded: %d records, %d compounds, %d distinct commodities",
            len(records), len(self._commodities_by_compound), len(self._all_commodities),
        )

    @classmethod
    def from_json_file(cls, path: str | Path) -> "MRLDatabase":
        path = Path(path)
        data = json.loads(path.read_text(encoding="utf-8"))
        raw_records = data["records"] if isinstance(data, dict) and "records" in data else data

        records = []
        for row in raw_records:
            compound = row.get(FIELD_MAP["compound"])
            commodity = row.get(FIELD_MAP["commodity"])
            mrl_value = row.get(FIELD_MAP["mrl_value"])
            flags = row.get(FIELD_MAP["mrl_flags"], "") or ""
            if not compound or not commodity:
                continue  # skip malformed rows rather than crash the whole load
            records.append(MRLRecord(
                compound=compound,
                commodity=commodity,
                mrl_value_mg_per_kg=mrl_value,
                mrl_flags=flags,
            ))
        return cls(records)

    def _fuzzy_match_commodity(self, commodity_query: str, cutoff: float = 0.70) -> Optional[str]:
        """
        Farmer-entered crop names ('tomato') rarely match the regulatory
        commodity string exactly ('Tomatoes'). Try an exact case-insensitive
        match first, then fall back to fuzzy matching.
        """
        matches = get_close_matches(commodity_query, self._all_commodities, n=1, cutoff=cutoff)
        return matches[0] if matches else None

    def lookup(self, compound: str, crop: str) -> Optional[MRLRecord]:
        key = (compound.strip().lower(), crop.strip().lower())
        record = self._by_compound_commodity.get(key)
        if record:
            return record

        # Try fuzzy commodity matching (e.g. "tomato" -> "Tomatoes", "avocado" -> "Avocado")
        fuzzy_commodity = self._fuzzy_match_commodity(crop)
        if fuzzy_commodity:
            fuzzy_key = (compound.strip().lower(), fuzzy_commodity.strip().lower())
            record = self._by_compound_commodity.get(fuzzy_key)
            if record:
                logger.debug("Matched crop '%s' -> commodity '%s' via fuzzy match", crop, fuzzy_commodity)
                return record

        return None

    def known_compounds(self) -> list[str]:
        return sorted({r.compound for r in self._by_compound_commodity.values()})


def estimate_residue_mg_per_kg(
    application_rate_mg_per_kg_equivalent: float,
    days_since_last_application: float,
    half_life_days: float,
) -> float:
    """
    First-order decay estimate of residue remaining at harvest:
    C(t) = C0 * exp(-k * t), where k = ln(2) / half_life.
    """
    import math
    if half_life_days <= 0:
        raise ValueError("half_life_days must be positive")
    k = math.log(2) / half_life_days
    return application_rate_mg_per_kg_equivalent * math.exp(-k * days_since_last_application)


class MRLValidator:
    """
    The safety gate: given a candidate compound + crop (+ optionally an
    expected/estimated residue level), decides whether it is legally
    safe to surface as a recommendation.
    """

    def __init__(self, db: MRLDatabase):
        self.db = db

    def validate(
        self,
        compound: str,
        crop: str,
        expected_residue_mg_per_kg: Optional[float] = None,
    ) -> ValidationResult:
        record = self.db.lookup(compound, crop)

        if record is None:
            return ValidationResult(
                compound=compound,
                crop=crop,
                status=ValidationStatus.NO_MRL_FOUND,
                message=(
                    f"No registered MRL for '{compound}' on '{crop}' in the reference "
                    f"standard. Treat as NOT APPROVED for this crop until confirmed "
                    f"against the current regulatory database — do not recommend."
                ),
            )

        if expected_residue_mg_per_kg is None:
            return ValidationResult(
                compound=compound,
                crop=crop,
                status=ValidationStatus.NEEDS_RESIDUE_ESTIMATE,
                mrl_limit_mg_per_kg=record.mrl_value_mg_per_kg,
                matched_commodity=record.commodity,
                message=(
                    f"MRL for '{compound}' on '{record.commodity}' is "
                    f"{record.mrl_value_mg_per_kg} mg/kg{record.mrl_flags or ''}. "
                    f"Supply an expected/estimated residue value to complete validation."
                ),
            )

        if record.mrl_value_mg_per_kg is None:
            return ValidationResult(
                compound=compound,
                crop=crop,
                status=ValidationStatus.NO_MRL_FOUND,
                matched_commodity=record.commodity,
                message="MRL entry exists but has no numeric limit on record — treat as not approved.",
            )

        if expected_residue_mg_per_kg > record.mrl_value_mg_per_kg:
            return ValidationResult(
                compound=compound,
                crop=crop,
                status=ValidationStatus.EXCEEDS_MRL,
                mrl_limit_mg_per_kg=record.mrl_value_mg_per_kg,
                estimated_residue_mg_per_kg=expected_residue_mg_per_kg,
                matched_commodity=record.commodity,
                message=(
                    f"Estimated residue {expected_residue_mg_per_kg} mg/kg EXCEEDS the "
                    f"legal MRL of {record.mrl_value_mg_per_kg} mg/kg for '{compound}' on "
                    f"'{record.commodity}'. This dosage/schedule must not be recommended."
                ),
            )

        return ValidationResult(
            compound=compound,
            crop=crop,
            status=ValidationStatus.COMPLIANT,
            mrl_limit_mg_per_kg=record.mrl_value_mg_per_kg,
            estimated_residue_mg_per_kg=expected_residue_mg_per_kg,
            matched_commodity=record.commodity,
            message=(
                f"Compliant: estimated residue {expected_residue_mg_per_kg} mg/kg is within "
                f"the {record.mrl_value_mg_per_kg} mg/kg MRL for '{compound}' on '{record.commodity}'."
            ),
        )

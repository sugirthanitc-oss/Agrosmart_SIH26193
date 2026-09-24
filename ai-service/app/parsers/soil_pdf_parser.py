import re
import io
from typing import Dict, Any, Tuple
from pypdf import PdfReader
from app.schemas import SoilHealthInput

# Official GoI Soil Health Card parameter standards
PARAMETER_PATTERNS = {
    "ph": [r"pH\s*(?:value|level)?[:\s=]+([0-9.]+)", r"Reaction\s*\([pP][hH]\)[:\s=]+([0-9.]+)"],
    "ec": [r"E\.?C\.?\s*(?:\(dS/m\))?[:\s=]+([0-9.]+)", r"Electrical\s+Conductivity[:\s=]+([0-9.]+)"],
    "organic_carbon": [r"(?:Organic\s+Carbon|OC)\s*(?:\(%\))?[:\s=]+([0-9.]+)", r"OC\s*[:=]\s*([0-9.]+)%?"],
    "n": [r"(?:Available\s+)?Nitrogen\s*\(N\)[:\s=]+([0-9.]+)", r"\bN\s*[:=]\s*([0-9.]+)\s*(?:kg/ha)?"],
    "p": [r"(?:Available\s+)?Phosphorus\s*\(P(?:2O5)?\)[:\s=]+([0-9.]+)", r"\bP\s*[:=]\s*([0-9.]+)\s*(?:kg/ha)?"],
    "k": [r"(?:Available\s+)?Potassium\s*\(K(?:2O)?\)[:\s=]+([0-9.]+)", r"\bK\s*[:=]\s*([0-9.]+)\s*(?:kg/ha)?"],
    "s": [r"(?:Available\s+)?Sulphur\s*\(S\)[:\s=]+([0-9.]+)", r"\bS\s*[:=]\s*([0-9.]+)\s*(?:ppm)?"],
    "zn": [r"(?:Available\s+)?Zinc\s*\(Zn\)[:\s=]+([0-9.]+)", r"\bZn\s*[:=]\s*([0-9.]+)\s*(?:ppm)?"],
    "b": [r"(?:Available\s+)?Boron\s*\(B\)[:\s=]+([0-9.]+)", r"\bB\s*[:=]\s*([0-9.]+)\s*(?:ppm)?"],
    "fe": [r"(?:Available\s+)?Iron\s*\(Fe\)[:\s=]+([0-9.]+)", r"\bFe\s*[:=]\s*([0-9.]+)\s*(?:ppm)?"],
    "mn": [r"(?:Available\s+)?Manganese\s*\(Mn\)[:\s=]+([0-9.]+)", r"\bMn\s*[:=]\s*([0-9.]+)\s*(?:ppm)?"],
    "cu": [r"(?:Available\s+)?Copper\s*\(Cu\)[:\s=]+([0-9.]+)", r"\bCu\s*[:=]\s*([0-9.]+)\s*(?:ppm)?"]
}

DEFAULT_SOIL_HEALTH = {
    "ph": 7.2,
    "ec": 0.45,
    "organic_carbon": 0.55,
    "n": 240.0,
    "p": 22.5,
    "k": 210.0,
    "s": 14.0,
    "zn": 0.85,
    "b": 0.52,
    "fe": 6.8,
    "mn": 4.5,
    "cu": 1.2
}

def parse_soil_health_card_pdf(file_bytes: bytes, filename: str = "card.pdf") -> Tuple[SoilHealthInput, Dict[str, Any]]:
    """
    Extracts 12 GoI Soil Health parameters from PDF stream or text.
    """
    extracted_text = ""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += "\n" + text
    except Exception as e:
        extracted_text = ""

    parsed_values = dict(DEFAULT_SOIL_HEALTH)
    detected_raw = {}

    if extracted_text:
        for param, patterns in PARAMETER_PATTERNS.items():
            for pattern in patterns:
                match = re.search(pattern, extracted_text, re.IGNORECASE)
                if match:
                    try:
                        val = float(match.group(1))
                        parsed_values[param] = val
                        detected_raw[param] = val
                        break
                    except ValueError:
                        pass

    soil_input = SoilHealthInput(
        ph=parsed_values["ph"],
        ec=parsed_values["ec"],
        organic_carbon=parsed_values["organic_carbon"],
        n=parsed_values["n"],
        p=parsed_values["p"],
        k=parsed_values["k"],
        s=parsed_values["s"],
        zn=parsed_values["zn"],
        b=parsed_values["b"],
        fe=parsed_values["fe"],
        mn=parsed_values["mn"],
        cu=parsed_values["cu"],
        source="Soil Health Card"
    )

    return soil_input, detected_raw

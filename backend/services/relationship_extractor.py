from backend.services.llm_service import (
    safe_generate
)

import json


def extract_relationships(text):

    prompt = f"""
Extract relationships.

Return ONLY JSON.

Example:

[
  {{
    "source":"Transformer",
    "relationship":"USED_FOR",
    "target":"Medical Diagnosis"
  }}
]

Text:

{text[:4000]}
"""

    try:

        response = safe_generate(
            prompt
        )

        if not response:

            return []

        return json.loads(
            response
        )

    except Exception as e:

        print(
            f"Relationship Error: {e}"
        )

        return []


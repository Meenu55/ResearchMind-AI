from backend.services.llm_service import (
    safe_generate
)

import json,re


def extract_entities(text):

    prompt = f"""
Extract the important entities from the following research text.

Return ONLY a JSON list.

Example:

["Transformer", "BERT", "Medical Diagnosis"]

Text:

{text[:4000]}
"""

    try:

        response = safe_generate(
            prompt
        )

        if not response:

            return []

        response = re.sub(
            r"```json|```",
            "",
            response
        ).strip()

        return json.loads(response)

    except Exception as e:

        print(
            f"Entity Error: {e}"
        )

        return []


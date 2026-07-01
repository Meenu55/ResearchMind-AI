from backend.services.llm_service import safe_generate
import json

def extract_relationships(text):
    prompt = f"""
You are building a research knowledge graph.

Extract ALL important relationships.

Allowed relationships:

USES
IMPROVES
DEPENDS_ON
COMPARES_WITH
APPLIED_TO
EXTENDS
RELATED_TO

Return ONLY JSON.

Example:

[
 {{
   "source":"RAG",
   "relationship":"USES",
   "target":"Vector Database"
 }},
 {{
   "source":"Agentic AI",
   "relationship":"DEPENDS_ON",
   "target":"Memory"
 }}
]

Text:

{text[:4000]}
"""

    result = safe_generate(prompt)

    if not result:
        return "AI generation temporarily unavailable."

    try:

        relationships = json.loads(result)

        cleaned_relationships = []
        VALID_RELATIONSHIPS = {
    "USES",
    "DEPENDS_ON",
    "IMPLEMENTS",
    "CONTAINS",
    "RELATES_TO",
    "GENERATES",
    "STORES",
    "RETRIEVES"
}

        for rel in relationships:

            if (
                "source" not in rel
                or "target" not in rel
                or "relationship" not in rel
            ):
                continue

            relationship = (
    rel["relationship"]
    .upper()
    .replace(" ", "_")
    .replace("-", "_")
)

            if relationship not in VALID_RELATIONSHIPS:
                relationship = "RELATES_TO"

            rel["relationship"] = relationship

            cleaned_relationships.append(
                rel
            )

        return cleaned_relationships

    except Exception as e:

        print(
            f"Relationship Error: {e}"
        )

        return []
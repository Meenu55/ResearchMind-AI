from fastapi import APIRouter
from backend.services.llm_service import safe_generate

router = APIRouter()

@router.post("/analyze-paper")
def analyze_paper(payload: dict):

    title = payload.get("title", "")
    abstract = payload.get("abstract", "")

    prompt = f"""
Analyze this research paper.

Title:
{title}

Abstract:
{abstract}

Provide:

# Objective

# Methodology

# Key Findings

# Limitations

# Future Work
"""

    result = safe_generate(prompt)

    return {
        "analysis": result
    }
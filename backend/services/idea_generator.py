from backend.services.llm_service import safe_generate


def generate_ideas(topic):

    prompt = f"""
You are a senior AI researcher.

Generate 5 novel research ideas for:

{topic}

Requirements:

- Novel
- Technically feasible
- Publishable
- Startup worthy
- Suitable for final year projects

For each idea provide:

## Title

## Problem

## Methodology

## Innovation

## Expected Impact

Return markdown only.
"""

    result = safe_generate(prompt)

    if not result:
        return "AI generation temporarily unavailable."
    return result
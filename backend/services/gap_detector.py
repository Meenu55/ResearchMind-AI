from backend.services.llm_service import (
    safe_generate
)
def collect_insights(
    papers
):

    insights = []

    for paper in papers:

        insights.append({

            "title":
            paper["title"],

            "abstract":
            paper["abstract"]

        })

    return insights

def identify_gaps(
    topic
):

    prompt = f"""
You are a research analyst.

Find major research gaps in:

{topic}

Include:

1. Technical limitations
2. Underexplored areas
3. Missing technologies
4. Open challenges
5. Future opportunities
"""

    result = safe_generate(
        prompt
    )

    result = safe_generate(prompt)

    if not result:
        return "AI generation temporarily unavailable."
    return result
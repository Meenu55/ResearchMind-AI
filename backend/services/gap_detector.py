from backend.gemini_client import model
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
    papers
):

    prompt = f"""

You are a research analyst.

Analyze these papers.

Identify:

1. Recurring limitations

2. Underexplored areas

3. Missing technologies

4. Research opportunities

5. Future directions

Papers:

{papers}

"""

    result = safe_generate(
        prompt
    )

    return result
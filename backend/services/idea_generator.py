from backend.gemini_client import model

from backend.services.llm_service import (
    safe_generate
)

def generate_ideas(
    gaps
):

    prompt = f"""

Based on these gaps:

{gaps}

Generate ideas that are:

- Novel
- Technically feasible
- Publishable
- Startup worthy
- Suitable for final year projects

"""

    result = safe_generate(
        prompt
    )

    return result
from backend.services.llm_service import (
    safe_generate
)

class ProposalAgent:

    def generate_proposal(
        self,
        topic,
        idea
    ):

        prompt = f"""
You are an expert research advisor.

Generate a detailed final-year project proposal.

Research Domain:
{topic}

Selected Research Idea:
{idea}

Include:

1. Project Title

2. Problem Statement

3. Objectives

4. Literature Background

5. Proposed Methodology

6. System Architecture

7. Technologies Required

8. Expected Outcomes

9. Future Scope

10. Implementation Timeline

11. References

Format using proper markdown.
"""

        result = safe_generate(prompt)

        if not result:
            return "AI generation temporarily unavailable."
        return result
from backend.services.llm_service import (
    generate_text
)

class ProposalAgent:

    def generate_proposal(

        self,

        topic,

        gaps,

        ideas,

        literature_review

    ):

        prompt = f"""

Create a complete research proposal.

Topic:
{topic}

Research Gaps:
{gaps}

Generated Ideas:
{ideas}

Literature Review:
{literature_review}

Generate:

1. Title

2. Abstract

3. Problem Statement

4. Objectives

5. Methodology

6. System Architecture

7. Expected Outcomes

8. Timeline

9. Future Work

"""

        return generate_text(
            prompt
        )
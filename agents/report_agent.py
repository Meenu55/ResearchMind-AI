from backend.services.llm_service import safe_generate


class ReportAgent:

    def build_report(
        self,
        papers,
        gaps,
        ideas
    ):

        prompt = f"""
        Create a professional research intelligence report.

        Papers:
        {papers}

        Research Gaps:
        {gaps}

        Novel Ideas:
        {ideas}

        Include:

        1. Executive Summary
        2. Key Papers
        3. Research Gaps
        4. Novel Ideas
        5. Future Directions
        """

     

        result = safe_generate(prompt)

        if not result:
            return "AI generation temporarily unavailable."
        return result

        
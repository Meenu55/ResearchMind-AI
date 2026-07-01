from backend.services.llm_service import (safe_generate)

class LiteratureReviewAgent:

    def generate_review(

        self,

        topic,

        papers

    ):

        prompt = f"""

Generate a professional literature review.

Topic:
{topic}

Papers:
{papers}

Structure:

1. Introduction

2. Related Work

3. Methodologies

4. Research Trends

5. Limitations

6. Future Directions

7. Conclusion

"""

        result = safe_generate(prompt)

        if not result:
            return "AI generation temporarily unavailable."
        
        return result
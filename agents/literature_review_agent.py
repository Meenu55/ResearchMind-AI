from backend.services.llm_service import (
    generate_text
)

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

        return generate_text(
            prompt
        )
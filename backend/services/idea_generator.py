from backend.gemini_client import model


def generate_ideas(
    gaps
):

    prompt = f"""

Based on these gaps:

{gaps}

Generate:

1. Novel project ideas

2. Startup ideas

3. Research directions

4. MVP concepts

"""

    response = model.generate_content(
        prompt
    )

    return response.text
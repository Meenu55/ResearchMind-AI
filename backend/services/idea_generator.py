from backend.gemini_client import model


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

    response = model.generate_content(
        prompt
    )

    return response.text
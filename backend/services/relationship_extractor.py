from backend.gemini_client import model

def extract_relationships(text):

    prompt = f"""

Extract relationships.

Return JSON.

Text:

{text}

"""

    response = model.generate_content(
        prompt
    )

    return response.text
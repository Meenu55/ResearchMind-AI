from backend.gemini_client import model

def extract_entities(text):

    prompt = f"""

Extract research entities.

Return only JSON.

Text:

{text}

"""

    response = model.generate_content(
        prompt
    )

    return response.text
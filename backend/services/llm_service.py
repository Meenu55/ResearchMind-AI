from backend.gemini_client import model

def safe_generate(prompt):

    try:

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:

        print(
            f"LLM Error: {e}"
        )

        return None
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

USE_MOCKS = False


def generate_text(prompt):

    if USE_MOCKS:
        return "Mock response"

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:

        print(
            f"LLM Error: {e}"
        )

        return None


def safe_generate(prompt):

    return generate_text(prompt)
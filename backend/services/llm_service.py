from backend.gemini_client import model

USE_MOCKS = True


def generate_text(prompt):

    if USE_MOCKS:

        return """
# Introduction

Agentic AI is an emerging research area.

# Related Work

Several studies explore multi-agent systems.

# Methodologies

Transformer architectures dominate.

# Research Trends

Agentic AI and multimodal systems.

# Limitations

Scalability remains challenging.

# Future Directions

Collaborative autonomous agents.

# Conclusion

Promising field for future research.
"""

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


def safe_generate(prompt):

    return generate_text(
        prompt
    )
from backend.gemini_client import model

USE_MOCKS = True


def generate_text(prompt):

    if USE_MOCKS:

        return """

# Title

ResearchMind AI

# Abstract

A multi-agent platform for automated
research intelligence.

# Problem Statement

Researchers spend significant time
reviewing literature manually.

# Objectives

- Automate literature review
- Detect research gaps
- Generate research proposals

# Methodology

Search Agent
Reader Agent
Gap Agent
Proposal Agent

# Expected Outcomes

Improved research productivity.

# Timeline

Month 1:
Literature Review

Month 2:
Implementation

Month 3:
Evaluation

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
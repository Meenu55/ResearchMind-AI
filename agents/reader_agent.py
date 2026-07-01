from pypdf import PdfReader
from sqlalchemy import text
from backend.services.graph_db import graph
from backend.services.entity_extractor import extract_entities

from backend.services.llm_service import (
    safe_generate
)
from backend.services.relationship_extractor import extract_relationships


from backend.services.graph_service import create_node,create_relationship


class ReaderAgent:
    
    def extract_text(self, pdf_path):

        reader = PdfReader(pdf_path)

        text = ""

        for page in reader.pages[:5]:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text

    def summarize_paper(self, text):

        prompt = f"""
    You are an expert research paper reviewer.

    Analyze the research paper below.

    IMPORTANT RULES:

    - NEVER copy or quote any part of the paper.
    - NEVER reproduce equations.
    - NEVER reproduce paragraphs.
    - NEVER include the original paper text.
    - ONLY produce your own analysis.
    - Start directly with "# Objective".
    - Return ONLY markdown.

    Use exactly this format:

    # Objective

    (2-4 sentences)

    # Methodology

    (Explain the approach)

    # Key Findings

    (Bullet points)

    # Limitations

    (Bullet points)

    # Future Work

    (Bullet points)

    Research Paper:

    {text[:6000]}
    """

        result = safe_generate(prompt)

        if not result:
            return "Unable to analyze the paper."

        return result



    def analyze_paper(
        self,
        pdf_path
    ):

        text = self.extract_text(
            pdf_path
        )

        try:

            entities = extract_entities(
                text
            )

        except:

            entities = (
    extract_entities(text)
    or []
)
        IGNORE = {
    "paper",
    "research",
    "study",
    "method",
    "approach",
    "model",
    "system",
    "framework"
}

        for entity in entities:

            if entity.lower() in IGNORE:
                continue

            try:

                create_node(entity)

            except Exception as e:

                print(e)

        try:

            relationships = extract_relationships(
                text
            )

        except:

            relationships = []

        for rel in relationships:

            if (
                "source" not in rel
                or "target" not in rel
                or "relationship" not in rel
            ):
                continue

            relationship = (
                rel["relationship"]
                .upper()
                .replace(" ", "_")
                .replace("-", "_")
            )

            try:

                graph.create_relationship(
                    rel["source"],
                    relationship,
                    rel["target"]
                )

            except Exception as e:

                print(
                    f"Graph Error: {e}"
                )

        summary = self.summarize_paper(
            text
        )

        return summary
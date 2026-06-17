from pypdf import PdfReader
from backend.gemini_client import model
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

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text

        return text


    def summarize_paper(self, text):

        prompt = f"""
        Analyze this research paper.

        Extract:

        1. Objective
        2. Methodology
        3. Findings
        4. Limitations
        5. Future Work

        Paper:

        {text[:20000]}
        """

        result = safe_generate(
    prompt
)

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
        for entity in entities:

            try:

                create_node(
                    entity
                )

            except Exception as e:

                print(e)

        try:

            relationships = extract_relationships(
                text
            )

        except:

            relationships = []

        for rel in relationships:

            try:

                create_relationship(
                    rel["source"],
                    rel["relationship"],
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
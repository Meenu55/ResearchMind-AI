from pypdf import PdfReader
from backend.gemini_client import model

class ReaderAgent:

    def extract_text(self, pdf_path):

        reader = PdfReader(pdf_path)

        text = ""

        for page in reader.pages:

            text += page.extract_text()

        return text

agent = ReaderAgent()

text = agent.extract_text(
    "sample_paper.pdf"
)

print(text[:1000])

def summarize_paper(self, text):

    prompt = f"""

Analyze this research paper.

Extract:

1. Research Objective

2. Methodology

3. Key Findings

4. Limitations

5. Future Work

6. Short Summary

Paper:

{text[:20000]}

"""

    response = model.generate_content(
        prompt
    )

    return response.text
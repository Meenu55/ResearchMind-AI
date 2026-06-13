from pypdf import PdfReader
from backend.gemini_client import model

from pypdf import PdfReader

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

def analyze_paper(
    self,
    pdf_path
):

    text = self.extract_text(
        pdf_path
    )

    summary = self.summarize_paper(
        text
    )

    return summary
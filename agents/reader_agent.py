from pypdf import PdfReader

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
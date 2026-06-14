import requests
import xml.etree.ElementTree as ET
from backend.services.vector_service import store_paper
import hashlib

class SearchAgent:

    def search_arxiv(self, query):

        url = (
            f"http://export.arxiv.org/api/query?"
            f"search_query=all:{query}"
            f"&start=0&max_results=5"
        )

        response = requests.get(url)

        root = ET.fromstring(response.text)

        namespace = {
            "atom": "http://www.w3.org/2005/Atom"
        }

        papers = []


        for entry in root.findall(
            "atom:entry",
            namespace
        ):

            title = entry.find(
                "atom:title",
                namespace
            ).text.strip()

            summary = entry.find(
                "atom:summary",
                namespace
            ).text.strip()

            # Unique ID for each paper
            paper_id = hashlib.md5(
                title.encode()
            ).hexdigest()

            try:

                store_paper(
                    paper_id=paper_id,
                    title=title,
                    abstract=summary
                )

            except Exception as e:

                print(
                    f"Vector Storage Error: {e}"
                )

            papers.append({
            "title": title,
            "abstract": summary
                })

        return papers

    def search(self, query):

        papers = self.search_arxiv(query)

        return {
            "query": query,
            "results": papers
        }
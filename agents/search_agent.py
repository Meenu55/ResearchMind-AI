import requests
import xml.etree.ElementTree as ET


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
import requests
import xml.etree.ElementTree as ET

class SearchAgent:

    def search_arxiv(self, query):

        url = (
            f"http://export.arxiv.org/api/query?"
            f"search_query=all:{query}"
            f"&start=0&max_results=10"
        )

        try:

            response = requests.get(url)

        except Exception:

            return []

        root = ET.fromstring(response.text)

        papers = []

        namespace = {
            'atom':
            'http://www.w3.org/2005/Atom'
        }

        for entry in root.findall(
            'atom:entry',
            namespace
        ):

            title = entry.find(
                'atom:title',
                namespace
            ).text

            summary = entry.find(
                'atom:summary',
                namespace
            ).text

            papers.append({
                "title": title,
                "abstract": summary
            })

        return papers
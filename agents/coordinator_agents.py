class CoordinatorAgent:

    def run(self, query):

        papers = search_agent.search(query)

        summary = reader_agent.analyze(papers)

        graph = graph_agent.build(papers)

        gaps = gap_agent.detect(papers)

        ideas = innovation_agent.generate(gaps)

        return {
            "papers": papers,
            "summary": summary,
            "graph": graph,
            "gaps": gaps,
            "ideas": ideas
        }
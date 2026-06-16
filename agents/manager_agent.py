from agents.search_agent import (
    SearchAgent
)

from agents.gap_agent import (
    GapAgent
)

from agents.innovation_agent import (
    InnovationAgent
)

from agents.report_agent import (
    ReportAgent
)

class ManagerAgent:

    def __init__(self):

        self.search_agent = SearchAgent()

        self.gap_agent = GapAgent()

        self.innovation_agent = InnovationAgent()

        self.report_agent = ReportAgent()

    def research(
        self,
        topic
    ):

        papers = self.search_agent.search(
            topic
        )["results"]

        gaps = self.gap_agent.detect(
            papers
        )

        ideas = self.innovation_agent.generate(
            gaps
        )

        report = self.report_agent.build_report(

            papers,

            gaps,

            ideas
        )

        return report
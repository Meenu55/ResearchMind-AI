from backend.services.gap_detector import (
    identify_gaps
)

class GapAgent:

    def detect(
        self,
        papers
    ):

        return identify_gaps(
            papers
        )
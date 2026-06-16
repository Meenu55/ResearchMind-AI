from backend.services.graph_query import (
    get_related
)

class GraphAgent:

    def find_related_topics(
        self,
        topic
    ):

        return get_related(
            topic
        )
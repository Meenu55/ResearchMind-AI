from backend.services.graph_db import (
    driver
)

def get_related(topic):

    with driver.session() as session:

        result = session.run(

            """

            MATCH (a)-[r]->(b)

            WHERE a.name=$topic

            RETURN b.name

            """,

            topic=topic
        )

        return [
            record["b.name"]
            for record in result
        ]
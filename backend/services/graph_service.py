from backend.services.graph_db import (
    driver
)

def create_node(name):

    with driver.session() as session:

        session.run(

            """

            MERGE (n:Concept {
                name:$name
            })

            """,

            name=name
        )
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


def create_relationship(
    source,
    relation,
    target
):

    with driver.session() as session:

        session.run(
            """
            MERGE (a:Concept {
                name:$source
            })

            MERGE (b:Concept {
                name:$target
            })

            MERGE (a)-[:RELATED]->(b)
            """,

            source=source,
            target=target
        )
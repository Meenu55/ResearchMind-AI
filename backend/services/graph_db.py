from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=(
        "neo4j",
        "password123"
    )
)

class GraphDB:

    def run(self, query):

        with driver.session() as session:

            result = session.run(
                query
            )

            return list(result)
        
    def create_node(
        self,
        name
    ):

        query = """
        MERGE (n:Concept {
            name:$name
        })
        """

        with driver.session() as session:

            session.run(
                query,
                name=name
            )

    def create_relationship(
        self,
        source,
        relation,
        target
    ):

        query = f"""
        MERGE (a:Concept {{
            name:$source
        }})

        MERGE (b:Concept {{
            name:$target
        }})

        MERGE (a)-[:{relation}]->(b)
        """

        with driver.session() as session:

            session.run(
                query,
                source=source,
                target=target
            )

graph = GraphDB()
from fastapi import APIRouter
from backend.services.graph_db import graph

router = APIRouter()

@router.get("/knowledge-graph")
def get_graph():

    result = graph.run("""
        MATCH (a)-[r]->(b)
        RETURN
            a.name AS source,
            b.name AS target,
            type(r) AS relation
        LIMIT 30
    """)

    nodes = {}
    links = []

    for row in result:

        source = row["source"]
        target = row["target"]

        nodes[source] = {
            "id": source
        }

        nodes[target] = {
            "id": target
        }

        links.append({
            "source": source,
            "target": target,
            "label": row["relation"]
        })

    return {
        "nodes": list(nodes.values()),
        "links": links
    }
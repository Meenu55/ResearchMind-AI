from fastapi import APIRouter
from backend.services.graph_db import graph

router = APIRouter()

@router.get("/node-details")
def node_details(name: str):

    query = """
    MATCH (a {name:$name})-[r]-(b)

    RETURN
    b.name AS related,
    type(r) AS relation
    LIMIT 50
    """

    relationships = graph.query(
        query,
        {
            "name": name
        }
    )

    # return {
    #     "node": name,
    #     "relationships": relationships
    # } 
    return {
    "node": "Agentic AI",
    "relationships": [
        {
            "related": "Memory",
            "relation": "USES"
        },
        {
            "related": "RAG",
            "relation": "IMPROVES"
        },
        {
            "related": "Tool Use",
            "relation": "ENABLES"
        }
    ]
}
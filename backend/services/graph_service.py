from backend.services.graph_db import graph

def create_node(name):

    graph.create_node(
        name
    )

def create_relationship(
    source,
    relation,
    target
):

    graph.create_relationship(
        source,
        relation,
        target
    )
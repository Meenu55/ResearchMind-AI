import networkx as nx

from pyvis.network import Network

def build_graph():

    graph = nx.Graph()

    return graph

def create_visual_graph(
    relationships
):

    graph = nx.Graph()

    for rel in relationships:

        graph.add_edge(

            rel["source"],

            rel["target"]
        )

    return graph

def export_html(
    graph
):

    net = Network(

        height="700px",

        width="100%"
    )

    net.from_nx(
        graph
    )

    net.save_graph(
        "graph.html"
    )
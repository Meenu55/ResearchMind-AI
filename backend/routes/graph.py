from fastapi import APIRouter

from backend.services.graph_query import (
    get_related
)

router = APIRouter()

@router.get("/graph")

def graph(topic:str):

    return {

        "related":

        get_related(topic)
    }
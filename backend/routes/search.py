from fastapi import APIRouter

from agents.search_agent import SearchAgent
from database.search_history import save_query

router = APIRouter()

agent = SearchAgent()


@router.get("/search")
def search(query: str):

    return agent.search(query)
    save_query(query)
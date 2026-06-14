from fastapi import APIRouter

from backend.services.semantic_search import (
    semantic_search
)

router = APIRouter()

@router.get(
    "/semantic-search"
)

def search(query: str):

    return semantic_search(
        query
    )
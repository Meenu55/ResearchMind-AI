from fastapi import APIRouter
from agents.gap_agent import identify_gaps

router = APIRouter()

@router.get("/gaps")
def gaps(topic: str):

    result = identify_gaps(topic)

    return {
        "gaps": result
    }
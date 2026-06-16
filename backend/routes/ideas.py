from fastapi import APIRouter

from backend.services.idea_generator import (
    generate_ideas
)

from database.idea_repository import (
    save_idea
)

router = APIRouter()

@router.post("/ideas")

def ideas(
    payload: dict
):

    generated_idea = generate_ideas(
        payload["gaps"]
    )

    save_idea(
        topic=payload["topic"],
        idea=generated_idea
    )

    return {
        "ideas":
        generated_idea
    }
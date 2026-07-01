from fastapi import APIRouter

from backend.services.idea_generator import (
    generate_ideas
)

router = APIRouter()


@router.get("/ideas")
def ideas(topic: str):

    generated_idea = generate_ideas(
        topic
    )

    return {
        "ideas": generated_idea
    }
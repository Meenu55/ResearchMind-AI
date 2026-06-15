from fastapi import APIRouter

from backend.services.idea_generator import (
    generate_ideas
)

router = APIRouter()

@router.post(
    "/ideas"
)

def ideas(
    payload: dict
):

    return {

        "ideas":

        generate_ideas(
            payload["gaps"]
        )
    }
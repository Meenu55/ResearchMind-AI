from fastapi import APIRouter

from database.idea_repository import (
    get_all_ideas
)

router = APIRouter()


@router.get(
    "/ideas/history"
)

def history():

    return {

        "ideas":
        get_all_ideas()

    }
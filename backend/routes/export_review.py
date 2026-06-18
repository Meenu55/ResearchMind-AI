from fastapi import APIRouter

from backend.services.review_exporter import (
    export_review
)

router = APIRouter()


@router.post(
    "/export-review"
)

def export(
    payload: dict
):

    filename = export_review(
        payload["review"]
    )

    return {

        "file":
        filename
    }
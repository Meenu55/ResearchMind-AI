from fastapi import APIRouter

from backend.services.gap_detector import (
    identify_gaps
)

router = APIRouter()

@router.post(
    "/gaps"
)

def detect_gaps(
    payload: dict
):

    return {

        "gaps":

        identify_gaps(
            payload["papers"]
        )
    }
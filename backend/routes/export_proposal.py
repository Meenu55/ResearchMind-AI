from fastapi import APIRouter

from backend.services.proposal_exporter import (
    export_proposal
)

router = APIRouter()


@router.post(
    "/export-proposal"
)

def export(
    payload: dict
):

    filename = export_proposal(

        payload["proposal"]

    )

    return {

        "file":
        filename

    }
from fastapi import APIRouter

from agents.proposal_agent import (
    ProposalAgent
)

router = APIRouter()

proposal_agent = ProposalAgent()


@router.post(
    "/proposal"
)

def proposal(
    payload: dict
):

    proposal_text = (

        proposal_agent.generate_proposal(

            payload["topic"],

            payload["gaps"],

            payload["ideas"],

            payload["literature_review"]

        )

    )

    return {

        "proposal":
        proposal_text

    }
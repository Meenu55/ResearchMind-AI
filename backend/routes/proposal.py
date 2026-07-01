from fastapi import APIRouter

from agents.proposal_agent import (
    ProposalAgent
)

router = APIRouter()

proposal_agent = ProposalAgent()


@router.get("/proposal")
def proposal(
    topic: str,
    idea: str
):

    proposal_text = (
        proposal_agent.generate_proposal(
            topic,
            idea
        )
    )

    return {
        "proposal": proposal_text
    }
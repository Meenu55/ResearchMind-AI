from fastapi import APIRouter

from agents.manager_agent import (
    ManagerAgent
)

router = APIRouter()

agent = ManagerAgent()


@router.get(
    "/research"
)

def research(
    topic: str
):

    return {

        "report":

        agent.research(
            topic
        )
    }
    
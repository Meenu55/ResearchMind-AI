from fastapi import APIRouter

from agents.search_agent import (
    SearchAgent
)

from agents.literature_review_agent import (
    LiteratureReviewAgent
)

router = APIRouter()

search_agent = SearchAgent()

review_agent = LiteratureReviewAgent()


@router.get(
    "/literature-review"
)

def literature_review(
    topic: str
):

    papers = search_agent.search(
        topic
    )["results"]

    review = review_agent.generate_review(

        topic,

        papers
    )

    return {

        "review":
        review

    }
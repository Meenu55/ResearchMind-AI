from fastapi import APIRouter

from agents.reader_agent import ReaderAgent

router = APIRouter()

agent = ReaderAgent()

@router.post("/analyze")

def analyze(payload: dict):

    result = agent.analyze_paper(
        payload["file_path"]
    )

    return {
        "analysis": result
    }
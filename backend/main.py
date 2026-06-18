from fastapi import FastAPI

from backend.routes.search import router

app = FastAPI()

app.include_router(router)

from backend.routes.upload import router as upload_router

app.include_router(upload_router)

from backend.routes.analyze import router as analyze_router

app.include_router(analyze_router)

from backend.routes.semantic_search import (
    router as semantic_router
)

app.include_router(
    semantic_router
)

from backend.routes.graph import (
    router as graph_router
)

app.include_router(
    graph_router
)

from backend.routes.graph_visualization import (
    router as graph_visual_router
)

app.include_router(
    graph_visual_router
)

from backend.routes.gaps import (
    router as gaps_router
)

from backend.routes.ideas import (
    router as ideas_router
)

app.include_router(
    gaps_router
)

app.include_router(
    ideas_router
)

from backend.routes.research import (
    router as research_router
)

app.include_router(
    research_router
)

from backend.routes.literature_review import (
    router as literature_router
)

app.include_router(
    literature_router
)

from backend.routes.proposal import (
    router as proposal_router
)

app.include_router(
    proposal_router
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,

    allow_origins=[

        "http://localhost:3000",

        "http://localhost:5173",

        "http://127.0.0.1:5173",

        "http://127.0.0.1:3000",

        "http://localhost:8080",

        "http://127.0.0.1:8080"

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)
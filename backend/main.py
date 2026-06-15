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
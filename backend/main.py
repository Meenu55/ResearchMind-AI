from fastapi import FastAPI

from backend.routes.search import router

app = FastAPI()

app.include_router(router)
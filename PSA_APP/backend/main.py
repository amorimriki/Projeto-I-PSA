from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from PSA_APP.backend.routes import prediction, history_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router)
app.include_router(history_routes.router)
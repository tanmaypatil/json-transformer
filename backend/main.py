from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import schema, transformations, execute

app = FastAPI(title="JSON Transformer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schema.router)
app.include_router(transformations.router)
app.include_router(execute.router)


@app.get("/health")
def health():
    return {"status": "ok"}

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from views import approvals
from models.approval_request_repository import ApprovalRequestRepository
from controllers.db import initialize_db

from controllers.generate_schema import create_approval_request_table, populate_db

app = FastAPI()
# CORS policy for backend to interact with the frontend
origins = [
"*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
db = initialize_db()

approval_request_repository = ApprovalRequestRepository(db)

# Backend entry point for all routers based on their high-level functions
app.include_router(approvals.router)

# uvicorn main:app --reload --port 5000
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from controllers.db import get_db_connection, create_table_on_first_load

from models.approval_request_repository import ApprovalRequestRepository
from views import approvals, permissions, templates

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

db = get_db_connection()
create_table_on_first_load()


# Backend entry point for all routers based on their high-level functions
app.include_router(approvals.router)
app.include_router(permissions.router)
app.include_router(templates.router)

# uvicorn main:app --reload --port 5000
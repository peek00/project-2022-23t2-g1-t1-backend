from fastapi import APIRouter, Depends
from models.ApprovalRequest import ApprovalRequest
from models.approval_request_repository import ApprovalRequestRepository
from controllers.db import initialize_db


router = APIRouter(
  prefix = "/approval",
  tags = ["Approvals"],
)

db = initialize_db()
approval_request_repository = ApprovalRequestRepository(db)

@router.get("/")
async def home():
    return {
        "message": "Welcome to the approvals API!",
    }
@router.get("/get-all", response_model=None)
async def get_all_approval_requests(
    # repo: ApprovalRequestRepository
):
    _ = approval_request_repository.get_all_approval_requests()
    return _

@router.post("/create", response_model=None)
def create_approval_requests(
    data: ApprovalRequest,
):
    return approval_request_repository.create_approval_request(data)

@router.get("/get-pending")
def get_pending_approval_requests():
    return approval_request_repository.get_pending_approval_requests()
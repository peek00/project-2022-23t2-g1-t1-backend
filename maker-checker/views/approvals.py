from fastapi import APIRouter, Depends, HTTPException
from models.ApprovalRequest import ApprovalRequest, ApprovalUpdate, ApprovalResponse, DeleteRequest
from models.approval_request_repository import ApprovalRequestRepository, ValidationError
from controllers.db import initialize_db


router = APIRouter(
  prefix = "/approval",
  tags = ["Approvals"],
)

def authorized_request():
    # Pseudo function to check if the user is authenticated and authoriuzed
    return True

db = initialize_db()
approval_request_repository = ApprovalRequestRepository(db)

@router.get("/")
async def home():
    return {
        "message": "Welcome to the approvals API!",
    }
@router.get("/get-all", response_model=None)
async def get_all_approval_requests(
):
    return approval_request_repository.get_all_approval_requests()
    

@router.post("/create", response_model=None)
def create_approval_requests(
    data: ApprovalRequest,
):
    if authorized_request():
        return approval_request_repository.create_approval_request(data)

@router.get("/get-pending")
def get_pending_approval_requests():
    return approval_request_repository.get_pending_approval_requests()

@router.get("/get-approved")
def get_pending_approval_requests():
    return approval_request_repository.get_approved_approval_requests()

@router.get("/get-rejected")
def get_pending_approval_requests():
    return approval_request_repository.get_rejected_approval_requests()

@router.post("/update")
def update_approval_request(
    data: ApprovalUpdate,
):
    if authorized_request():
        return approval_request_repository.update_approval_request(data)
    
@router.post("/response")
def approve_approval_request(
    data: ApprovalResponse,
):
    if authorized_request():
        return approval_request_repository.approve_or_reject_approval_request(data)
    
@router.post("/withdraw")
def withdraw_approval_request(
    data: ApprovalResponse,
):
    try:
        if authorized_request():
            return approval_request_repository.withdraw_approval_request(data)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/delete")
def delete_approval_request(
    data: DeleteRequest,
):
    if authorized_request():
        return approval_request_repository.delete_approval_request(data)
# ======== Approver Endpoints ====-====
# @router.get("")
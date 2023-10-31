from pydantic import BaseModel, Field
from uuid import uuid4
from enum import Enum
from typing import Dict, Optional, Any
from datetime import datetime, timedelta

class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    # EXPIRED = "expired"

class ApprovalRequest(BaseModel):
    uid: str = Field(default_factory=lambda: str(uuid4()))
    requestor_id: str
    request_type: str
    request_details: Dict[str, Any]
    status: ApprovalStatus
    created_at: str = datetime.now().isoformat()
    comments: Optional[str] = None
    request_title: Optional[str] = None
    request_expiry: str = (datetime.now() + timedelta(days=5)).isoformat()
    approval_role: str 

class ApprovalUpdate(BaseModel):
    """
    Used when original requestor wants to make an update to the details.
    Request cannot be updated once modified. 
    """
    uid: str # Link to request to update
    requestor_id: str # Verify that the requestor is the same
    status: Optional[ApprovalStatus] = None
    comments: Optional[str] = None
    request_details: Optional[Dict[str, str]] = None
    request_title: Optional[str] = None
    request_expiry: Optional[str] = None

class ApprovalResponse(BaseModel):
    """
    Base model used when an approver rejects or approves a request.
    """
    uid: str
    status: ApprovalStatus
    approver_id: str
    comments: Optional[str] = None
    resolution_at: str = datetime.now().isoformat()

class DeleteRequest(BaseModel):
    uid: str
    requestor_id: str

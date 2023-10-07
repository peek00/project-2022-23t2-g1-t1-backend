from pydantic import BaseModel, Field, Optional
from uuid import uuid4
from enum import Enum
from typing import Dict
from datetime import datetime, timedelta

class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    EXPIRED = "expired"

class ApprovalRequest(BaseModel):
    uid: str = Field(default_factory=lambda: str(uuid4()))
    requestor_id: int
    request_type: str
    request_details: Dict[str, str]
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
    status: Optional[ApprovalStatus]
    comments: Optional[str]
    request_details: Optional[Dict[str, str]]
    request_title: Optional[str]
    request_expiry: Optional[str]

class ApprovalResponse(BaseModel):
    """
    Base model used when an approver rejects or approves a request.
    """
    status: ApprovalStatus
    approver_id: int
    comments: Optional[str]
    resolution_at: str = datetime.now().isoformat()
    

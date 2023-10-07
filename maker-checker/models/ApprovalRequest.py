from pydantic import BaseModel, Field
from uuid import uuid4
from enum import Enum
from typing import Dict

class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ApprovalRequest(BaseModel):
    uid: str = Field(default_factory=lambda: str(uuid4()))
    requestor_id: int
    request_type: str
    request_details: Dict[str, str]
    status: ApprovalStatus
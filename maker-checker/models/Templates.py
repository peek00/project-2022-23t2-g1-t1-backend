from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from uuid import uuid4
class Templates(BaseModel):
    uid: str = Field(default_factory=lambda: str(uuid4())[:6])
    type: str
    allowed_requestors: List[str]
    allowed_approvers: List[str]
    details: Dict
    desc: Optional[str] = None
    
    class Config:
        orm_mode = True

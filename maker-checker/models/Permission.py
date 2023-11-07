from pydantic import BaseModel
from typing import List

class Permission(BaseModel):
    role: str
    approved_actions: List[str]
    class Config:
        orm_mode = True

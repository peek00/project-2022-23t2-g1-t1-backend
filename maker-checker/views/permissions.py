from typing import Optional, List
from fastapi import APIRouter, HTTPException, Header

from controllers.db import get_db_connection, create_table_on_first_load
from models.approval_permission_repository import ApprovalRequestPermissionRepo
from models.approval_template_repository import ApprovalRequestTemplateRepo
from models.Permission import Permission



router = APIRouter(
    prefix="/permission",
    tags=["Permission"],
)

db = get_db_connection()

permission_repository = ApprovalRequestPermissionRepo(db)
template_repository = ApprovalRequestTemplateRepo(db)


@router.get("/")
async def get_all_permission(
    role: Optional[str] = None,
):
    """
    Get all permission.
    """
    try:
        if role:
            response = permission_repository.get_specific_permission(role)
            return response
        response = permission_repository.get_all_permission()
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_permission(
    permission: Permission,
    userid:str = Header(None)
):
    """
    Create a new permission
    """
    try:
        # Get and check if it exists
        request = permission_repository.get_specific_permission(permission.role)
        if request == []:
            permission_repository.create_permission(userid, permission)
        else:
            raise ValueError("Permission already exists")
        response = {
            "logInfo": f"User {userid} added permissions for {permission.role} for actions {permission.approved_actions}.",
            "message": "Permission created successfully."
        }
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.put("/")
async def update_permission(
    permission: Permission,
    userid:str = Header(None)
):
    """
    Update permission
    """
    try:
          # Get and check if it exists
        request = permission_repository.get_specific_permission(permission.role)
        if request == []:
            raise ValueError("Permission does not exists.")
        else:
            response = permission_repository.update_permission(userid, permission)
        response = {
            "logInfo": f"User {userid} updated permissions for {permission.role} for actions {permission.approved_actions}.",
            "message": "Permission updated successfully."
        }
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Header

from controllers.db import get_db_connection, create_table_on_first_load
from models.approval_permission_repository import ApprovalRequestPermissionRepo
from models.Permission import Permission



router = APIRouter(
    prefix="/permission",
    tags=["Permission"],
)

db = get_db_connection()

permission_repository = ApprovalRequestPermissionRepo(db)


@router.get("/")
async def get_all_permission(
    role: Optional[str] = None,
    companyid: str = Header(None)
):
    """
    Get all permission by companyid
    """
    try:
        if role:
            response = permission_repository.get_specific_permission(
                companyid, role)
            return response
        response = permission_repository.get_all_permission(companyid)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_permission(
    permission: Permission,
    companyid: str = Header(None),
    userid:str = Header(None)
):
    """
    Create a new permission
    """
    try:
        # Get and check if it exists
        request = permission_repository.get_specific_permission(companyid, permission.role)
        if request == []:
            permission_repository.create_permission(companyid, userid, permission)
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
    
@router.post("/add")
async def add_permission(
    role:str,
    action:str | List[str],
    companyid: str = Header(None),
    userid:str = Header(None)
):
    """
    Adds one permission at a time to a role.
    """
    try:
        # Get and check if it exists
        request = permission_repository.get_specific_permission(companyid, role)
        if request == []:
            raise ValueError("Permission does not exists")
        else:
            if isinstance(action, list):
                for a in action:
                    permission_repository.add_permission(companyid, userid, role, a)
            else: 
                permission_repository.add_permission(companyid, userid, role, action)
        response = {
            "logInfo": f"User {userid} added permissions for {role} for action {action}.",
            "message": "Permission updated successfully."
        }
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@router.put("/")
async def update_permission(
    permission: Permission,
    companyid: str = Header(None),
    userid:str = Header(None)
):
    """
    Update permission
    """
    try:
          # Get and check if it exists
        request = permission_repository.get_specific_permission(companyid, permission.role)
        if request == []:
            raise ValueError("Permission does not exists.")
        else:
            response = permission_repository.update_permission(companyid, userid, permission)
        response = {
            "logInfo": f"User {userid} updated permissions for {permission.role} for actions {permission.approved_actions}.",
            "message": "Permission updated successfully."
        }
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
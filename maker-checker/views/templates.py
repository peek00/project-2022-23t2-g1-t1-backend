from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status

from controllers.db import get_db_connection
from models.approval_template_repository import ApprovalRequestTemplateRepo
from models.approval_permission_repository import ApprovalRequestPermissionRepo
from models.Templates import Templates, TemplateUpdate
from models.Errors import UnauthorizedError

router = APIRouter(
    prefix="/templates",
    tags=["Templates"],
)

db = get_db_connection()
template_repository = ApprovalRequestTemplateRepo(db)
permission_repository = ApprovalRequestPermissionRepo(db)

def validate_template_object(template: Templates):
    """
    Validates that the template has allowed_requestors and allowed_approvers
    """
    if template.allowed_requestors == [] or template.allowed_approvers == []:
        raise ValueError("Allowed requestors and approvers cannot be empty.")
    if template.details == {}:
        raise ValueError("Details cannot be empty.")
    return True

@router.get("/")
async def get_all_templates(
    uid: Optional[str] = None,
    companyid: str = Header(None)
):
    """
    Get all templates by companyid
    """
    try:
        if companyid == None:
            raise UnauthorizedError("Companyid cannot be empty.")
        if uid:
            response = template_repository.get_specific_template(
                companyid, uid)
            return response
        response = template_repository.get_all_templates(companyid)
        return response
    except UnauthorizedError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_template(
    template: Templates,
    companyid: str = Header(None),
    userid:str = Header(None)
):
    """
    Create a new template. When a template is created, need to update permissions.
    """
    try:
        # Validate that approved requestor and approvers is not none
        validate_template_object(template)

        template_repository.create_template(companyid, userid, template)
            # Updating permissions
        for role in template.allowed_requestors:
            permission_repository.add_permission(companyid, userid, role, template.uid)

        response = {
            "logInfo": f"User {userid} added template {template.uid} for action {template.type}.",
            "message": "Template created successfully."
        }
        return (response)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/")
async def update_template(
    template: TemplateUpdate,
    companyid: str = Header(None),
    userid:str = Header(None)
):
    """
    Update a template, you can set a template to have no allowed requestors or approvers.
    """
    try:
        # Get and check if it exists
        request = template_repository.get_specific_template(companyid, template.uid)
        if request != []:
            template_repository.update_template(companyid, userid, template)
        else:
            raise ValueError("Template does not exist")
        response = {
            "logInfo": f"User {userid} updated template {template.uid} for action {template.type}.",
            "message": "Template updated successfully."
        }
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/")
async def delete_template(
    uid: str,
    companyid: str = Header(None),
    userid:str = Header(None)
):
    """
    Delete a template
    """
    try:
        # Get and check if it exists
        if companyid == None or userid == None:
            raise UnauthorizedError("Companyid and userid cannot be empty.")
        request = template_repository.get_specific_template(companyid, uid)
        if request != []:
            template_repository.delete_template(companyid, uid)
        else:
            raise ValueError("Template does not exist")
        response = {
            "logInfo": f"User {userid} deleted template {uid}.",
            "message": "Template deleted successfully."
        }
        return response
    except UnauthorizedError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
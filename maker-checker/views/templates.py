from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status

from controllers.db import get_db_connection
from models.approval_template_repository import ApprovalRequestTemplateRepo
from models.Templates import Templates, TemplateUpdate
from models.Errors import UnauthorizedError

router = APIRouter(
    prefix="/templates",
    tags=["Templates"],
)

db = get_db_connection()
template_repository = ApprovalRequestTemplateRepo(db)

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
):
    """
    Get all templates.
    """
    try:
        
        if uid != None:
        
        if uid != None:
            response = template_repository.get_specific_template(uid)
            return response
        response = template_repository.get_all_templates()
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
    userid:str = Header(None)
):
    """
    Create a new template. When a template is created, need to update permissions.
    """
    try:
        # Validate that approved requestor and approvers is not none
        validate_template_object(template)

        template_repository.create_template(userid, template)
            # Updating permissions
        for role in template.allowed_requestors:
            permission_repository.update_permissions(userid, role, template.uid)

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
    userid:str = Header(None)
):
    """
    Update a template, you can set a template to have no allowed requestors or approvers.
    Update will automatically edited permissions too. 
    """
    try:
        # Get and check if it exists
        request = template_repository.get_specific_template(template.uid)
        if request != []:
            template_repository.update_template(userid, template)
            permission_repository.update_permissions(userid, template.allowed_requestors, template.uid)
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

@router.get("/allowed_requestors")
async def get_allowed_requestors(
    role: str
    ):
    """
    Traverses entire DB and scans all templates to find all allowed requestors for a given role.
    """
    try:
        response = template_repository.get_allowed_requestors(role)
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.delete("/")
async def delete_template(
    uid: str,
    userid:str = Header(None)
):
    """
    Delete a template
    """
    try:
        # Get and check if it exists
        if userid == None:
            raise UnauthorizedError("Userid cannot be empty.")
        request = template_repository.get_specific_template(uid)
        if request != []:
            template_repository.delete_template(uid)
            # TODO: Delete permission
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
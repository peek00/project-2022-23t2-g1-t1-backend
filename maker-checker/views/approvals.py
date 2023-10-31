from fastapi import APIRouter, Depends, HTTPException
from models.ApprovalRequest import ApprovalRequest, ApprovalUpdate, ApprovalResponse, DeleteRequest
from models.approval_request_repository import ApprovalRequestRepository, ValidationError
from controllers.db import initialize_db
from botocore.exceptions import ClientError
from datetime import datetime

router = APIRouter(
  prefix = "/approval",
  tags = ["Approvals"],
)


def isExpired(expiry_date:str):
    """
    Takes in a string in isoformat and uses current time 
    to determine if it is expired.
    """
    return datetime.now() > datetime.fromisoformat(expiry_date)

db = initialize_db()
approval_request_repository = ApprovalRequestRepository(db)

@router.get("/")
async def healthcheck():
    return {
        "message": "Welcome to the approvals API! Endpoint is working.",
    }

# =================== START: GET requests =======================
@router.get("/get-all", response_model=None)
async def get_all_requests(
    company_id: str
):
    try:
        return approval_request_repository.get_all_approval_requests(company_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-pending")
def get_pending_requests(
    company_id: str,
    requestor_id: str = None,
):
    try:
        if requestor_id:
            return approval_request_repository.get_pending_approval_requests_by_requestor_id(company_id, requestor_id)
        return approval_request_repository.get_pending_approval_requests(company_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-not-pending")
def get_not_pending_requests_by_requestor_id(
    company_id: str,
    requestor_id: str = None,
):
    try:
        if requestor_id:
            return approval_request_repository.get_non_pending_approval_requests_by_requestor_id(company_id, requestor_id)
        return approval_request_repository.get_non_pending_approval_requests(requestor_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-approved")
def get_approved_requests(company_id:str):
    try:
        return approval_request_repository.get_approved_approval_requests(company_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-rejected")
def get_rejected_requests(company_id:str):
    try:
        return approval_request_repository.get_rejected_approval_requests(company_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-expired")
def get_expired_requests(company_id:str):
    try:
        return approval_request_repository.get_expired_approval_requests(company_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-by-id")
def get_request_by_id(
    company_id: str,
    request_id: str,
):
    try:
        return approval_request_repository.get_approval_request_by_uid(company_id, request_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-by-requestor")
def get_request_by_requestor_id(
    company_id: str,
    requestor_id: str,
):
    try:
        return approval_request_repository.get_approval_request_by_requestor_id(company_id, requestor_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-by-approver")
def get_request_by_approver_id(
    company_id: str,
    approver_id: str,
):
    try:
        return approval_request_repository.get_approval_request_by_approver_id(company_id, approver_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
# =================== END: GET requests =======================

# =================== START: REQUESTOR requests =======================

@router.post("/create", response_model=None)
def create_approval_requests(
    data: ApprovalRequest,
):
    try:
        # TODO : Put in validation  that data has request details
        result = approval_request_repository.create_approval_request(data)
        # TODO: Japheth send email notifications here
        response = {
            "logInfo" : f"ID {data.requestor_id} created a request with ID {data.uid} for {data.approval_role} approval.",
            "request_id" : data.uid,
            "message": "Created!"
        }
        return response
    except ValidationError  as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/update")
def update_approval_request(
    data: ApprovalUpdate,
):
    try:
        # Get the original request
        original_request = approval_request_repository.get_approval_request_by_uid(data.uid)
        # Check if request exists
        if original_request == None:
            raise ValueError("Request does not exist.")
        # Check if requestID is the same, only the original requestor can update
        if original_request["requestor_id"] != data.requestor_id:
            raise ValueError("Requestor ID does not match the original requestor ID.")
        # Check if request is pending, only pending requests can be updated
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be updated.")
        # Check if request is expired, only pending requests can be updated
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be updated.")
        
        result = approval_request_repository.update_approval_request(data)
        response = {
            "logInfo" : f"ID {data.requestor_id} updated Request ID {data.uid}, Request Status is now {data.status}.",
            "result" : result
        }
        return response
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/withdraw")
def withdraw_approval_request(
    data: ApprovalResponse,
):
    try:
        original_request = approval_request_repository.get_approval_request_by_uid(data.uid)
       
        if original_request == None:
            raise ValueError("Request does not exist.")
        if original_request["requestor_id"] != data.approver_id:
            raise ValueError("Requestor ID does not match the original requestor ID.")
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be withdrawn.")
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be withdrawn.")
        if data.status != "withdrawn":
            raise ValueError("Request can only be withdrawn.")
        
        result = approval_request_repository.withdraw_approval_request(data)
        response = {
            "logInfo" : f"ID {data.requestor_id} withdrew Request ID {data.uid}",
            "result" : result
        }
        return response
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/delete")
def delete_approval_request(
    data: DeleteRequest,
):
    try:
        original_request = approval_request_repository.get_approval_request_by_uid(data.uid)
        if original_request == None:
            raise ValueError("Request does not exist.")
        if original_request["requestor_id"] != data.requestor_id:
            raise ValueError("Requestor ID does not match the original requestor ID.")
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be deleted.")
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be deleted.")
        
        result = approval_request_repository.delete_approval_request(data)
        response = {
            "logInfo" : f"ID {data.requestor_id} deleted Request ID {data.uid}",
            "result" : result
        }
        return response
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# =================== END: REQUESTOR requests =======================

# =================== START: CHECKER requests =======================

@router.post("/response")
def approve_or_reject_approval_request(
    data: ApprovalResponse,
):
    try: 
        original_request = approval_request_repository.get_approval_request_by_uid(data.uid)
        if original_request["requestor_id"] == data.approver_id:
            raise ValueError("Requestor cannot be the approver.")
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be updated.")
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be updated.")
        
        if data.status == "approved":
            action = "approved"
            # TODO: Japheth do things here
            # Make a call to points storage to update transaction
        elif data.status == "rejected":
            action = "rejected"

        #Only update DB if above call to other microservice is successful
        result = approval_request_repository.approve_or_reject_approval_request(data)

        response = {
            "logInfo" : f"ID {data.requestor_id} {action} Request ID {data.uid}",
            "result" : result
        }
        return response
    
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# =================== END: CHECKER requests =======================

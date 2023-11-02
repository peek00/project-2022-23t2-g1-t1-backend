from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import ValidationError

from models.ApprovalRequest import ApprovalRequest, ApprovalUpdate, ApprovalResponse, DeleteRequest
from models.approval_request_repository import ApprovalRequestRepository
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
    company_id: str = Header(..., description="Company ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and returns all requests made in the company table.

    ### Parameters:
    `company_id`: Company ID.<br /><br />

    ### Returns:
    A JSON object containing a list of every requests made in the company.
    If the company ID does not exist, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-all?company_id=ascenda
    ```
    #### Response:
    ```
        [
            {
                "uid": "0428962d-81f3-416d-9e7f-34ff34301251",
                "comments": "Optional comment for this particular request",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "requestor_id": "admin1",
                "created_at": "2023-10-31T05:13:10.303989",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "approval_role": "ADMIN",
                "request_expiry": "2023-11-05T05:13:10.304010",
                "status": "pending"
            },
            {
                "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
                "comments": "Optional comment for this particular request",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "requestor_id": "admin1",
                "created_at": "2023-10-31T07:49:20.158263",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "approval_role": "ADMIN",
                "request_expiry": "2023-11-05T07:49:20.158278",
                "status": "pending"
            }
        ]
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None:
            raise ValueError("Company ID is required.")
        return approval_request_repository.get_all_approval_requests(company_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-pending")
def get_pending_requests(
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from the header.
    This returns all pending request originating from the requestor.

    ### Parameters:
    `company_id`: Company ID, taken from header.<br /><br />
    `requestor_id`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of non expired, pending requests
    made by a specific requestor.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-pending
    headers = {
        "company_id": "ascenda",
        "requestor_id": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "uid": "0428962d-81f3-416d-9e7f-34ff34301251",
                "comments": "Optional comment for this particular request",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "requestor_id": "admin1",
                "created_at": "2023-10-31T05:13:10.303989",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "approval_role": "ADMIN",
                "request_expiry": "2023-11-05T05:13:10.304010",
                "status": "pending"
            },
            {
                "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
                "comments": "Optional comment for this particular request",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "requestor_id": "admin1",
                "created_at": "2023-10-31T07:49:20.158263",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "approval_role": "ADMIN",
                "request_expiry": "2023-11-05T07:49:20.158278",
                "status": "pending"
            }
        ]
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None:
            raise ValueError("Company ID is required.")
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
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from the header.

    Not pending requests are requests that have been approved, rejected, 
    withdrawn or expired. Expired requests may have status PENDING.

    This will return all not pending requests originating from the requestor.

    ### Parameters:
    `company_id`: Company ID, taken from header.<br /><br />
    `requestor_id`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of not pending requests
    made by a specific requestor.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-not-pending
    headers = {   
        "company_id": "ascenda",
        "requestor_id": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "uid": "0428962d-81f3-416d-9e7f-34ff34301251",
                "comments": "Optional comment for this particular request",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "requestor_id": "admin1",
                "created_at": "2023-10-31T05:13:10.303989",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "approval_role": "ADMIN",
                "request_expiry": "2023-11-05T05:13:10.304010",
                "status": "pending"
            },
            {
                "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
                "comments": "Optional comment for this particular request",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "requestor_id": "admin1",
                "created_at": "2023-10-31T07:49:20.158263",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "approval_role": "ADMIN",
                "request_expiry": "2023-11-05T07:49:20.158278",
                "status": "pending"
            }
        ]
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None:
            raise ValueError("Company ID is required.")
        if requestor_id:
            return approval_request_repository.get_non_pending_approval_requests_by_requestor_id(company_id, requestor_id)
        return approval_request_repository.get_non_pending_approval_requests(requestor_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-approved")
def get_approved_requests(
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
    ):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from the header.

    It will return all approved requests made by the requestor 
    in the company table.

    ### Parameters:
    `company_id`: Company ID, taken from header.<br /><br />
    `requestor_id`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of APPROVED requests
    made by a specific requestor in the company.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-approved
    headers = {
        "company_id": "ascenda",
        "requestor_id": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "comments": "Be civil",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "requestor_id": "admin1",
                "approver_id": "abc-567",
                "created_at": "2023-10-31T07:49:20.158263",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
                "request_title": "Optional title for this particular request",
                "approval_role": "ADMIN",
                "resolution_at": "2023-10-31T12:11:06.940408",
                "request_expiry": "2023-11-05T07:49:20.158278",
                "status": "approved"
            }
        ]
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None:
            raise ValueError("Company ID is required.")
        if requestor_id:
            return approval_request_repository.get_approved_approval_requests_by_requestor_id(company_id, requestor_id)
        return approval_request_repository.get_approved_approval_requests(company_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-rejected")
def get_rejected_requests(
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
    ):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from header.

    It will return all rejected requests made by the requestor.

    ### Parameters:
    `company_id`: Company ID, taken from header.<br /><br />
    `requestor_id`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of REJECTED requests
    made by a specific requestor.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-rejected
    headers = {
        "company_id": "ascenda",
        "requestor_id": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "comments": "Be civil",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "requestor_id": "admin1",
                "approver_id": "abc-567",
                "created_at": "2023-10-31T07:49:20.158263",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
                "request_title": "Optional title for this particular request",
                "approval_role": "ADMIN",
                "resolution_at": "2023-10-31T12:11:06.940408",
                "request_expiry": "2023-11-05T07:49:20.158278",
                "status": "rejected"
            }
        ]
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None:
            raise ValueError("Company ID is required.")
        if requestor_id:
            return approval_request_repository.get_rejected_approval_requests_by_requestor_id(company_id, requestor_id)
        return approval_request_repository.get_rejected_approval_requests(company_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-expired")
def get_expired_requests(
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
    ):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from headers.

    It will return all expired requests that are PENDING 
    MADE BY THE REQUESTOR in the company table.

    ### Parameters:
    `company_id`: Company ID, taken from header.<br /><br />
    `requestor_id`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of expired requests that are still pending
    made by a specific requestor.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-expired
    headers = {
        "company_id": "ascenda",
        "requestor_id": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
                "comments": "Optional comment for this particular request",
                "company_id": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "requestor_id": "admin1",
                "created_at": "2023-10-31T07:49:20.158263",
                "request_details": {
                    "increment": "False",
                    "amount": 100,
                    "account_id": 456789
                },
                "approval_role": "ADMIN",
                "request_expiry": "2023-11-05T07:49:20.158278",
                "status": "pending"
            }
        ]
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None: 
            raise ValueError("Company ID is required.")
        if requestor_id:
            return approval_request_repository.get_expired_approval_requests_by_requestor_id(company_id, requestor_id)
        return approval_request_repository.get_expired_approval_requests(company_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-by-id")
def get_request_by_id(
    company_id: str = Header(..., description="Company ID"),
    request_id: str = None,
):
    """
    ### Description:
    This endpoint takes in a company ID and request ID 
    and returns the request details.

    ### Parameters:
    `company_id`: Company ID.<br /><br />
    `request_id`: Request ID.<br /><br />

    ### Returns:
    A JSON object containing details of the request.
    If request is not found, return 404.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-by-id?company_id=ascenda
    GET /approval/get-by-id?company_id=ascenda&request_id=66c0bef1-ff98-4507-9b58-9908bc49fc26
    ```
    #### Response:
    ```
       {
            "comments": Be Civil",
            "company_id": "ascenda",
            "request_type": "Transaction",
            "requestor_id": "admin1",
            "approver_id": "abc-567",
            "created_at": "2023-10-31T07:49:20.158263",
            "request_details": {
                "increment": "False",
                "amount": 100,
                "account_id": 456789
            },
            "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
            "request_title": "Optional title for this particular request",
            "approval_role": "ADMIN",
            "resolution_at": "2023-10-31T12:11:06.940408",
            "request_expiry": "2023-11-05T07:49:20.158278",
            "status": "approved"
        }
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `404 Not Found`: The request was not found.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None or request_id == None:
            raise ValueError("Company ID and request_id is required.")
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
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID 
    and returns all requests made by requestor.

    ### Parameters:
    `company_id`: Company ID.<br /><br />
    `requestor_id`: Requestor ID.<br /><br />

    ### Returns:
    A JSON object containing a list of requests made by the requestor.
    If non, return empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-by-requestor
    headers = {
        "company_id": "ascenda",
        "requestor_id": "admin1"
    }
    ```
    #### Response:
    ```
    [
        {
            "uid": "0428962d-81f3-416d-9e7f-34ff34301251",
            "comments": "Optional comment for this particular request",
            "company_id": "ascenda",
            "request_type": "Transaction",
            "request_title": "Optional title for this particular request",
            "requestor_id": "admin1",
            "created_at": "2023-10-31T05:13:10.303989",
            "request_details": {
                "increment": "False",
                "amount": 100,
                "account_id": 456789
            },
            "approval_role": "ADMIN",
            "request_expiry": "2023-11-05T05:13:10.304010",
            "status": "pending"
        }, ...
    ]
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None and requestor_id == None:
            raise ValueError("Company ID and requestor_id is required.")
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
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str = Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID 
    and returns all request responded to by the requestor. 

    ### Parameters:
    `company_id`: Company ID, taken from header.<br /><br />
    `requestor_id`: Requestor ID, taken from header<br /><br />

    ### Returns:
    A JSON object containing a list of requests responded by the requestor.
    If non, return empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-by-approver
    headers = {
        "company_id": "ascenda",
        "requestor_id": "admin1"
    }
    ```
    #### Response:
    ```
    [
    {
        "comments": "Be civil",
        "company_id": "ascenda",
        "request_type": "Transaction",
        "requestor_id": "admin1",
        "approver_id": "abc-567",
        "created_at": "2023-10-31T07:49:20.158263",
        "request_details": {
            "increment": "False",
            "amount": 100,
            "account_id": 456789
        },
        "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
        "request_title": "Optional title for this particular request",
        "approval_role": "ADMIN",
        "resolution_at": "2023-10-31T12:11:06.940408",
        "request_expiry": "2023-11-05T07:49:20.158278",
        "status": "approved"
    }
]
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        if company_id == None or requestor_id == None:
            raise ValueError("Company ID and approver_id is required.")
        return approval_request_repository.get_approval_request_by_approver_id(company_id, requestor_id)
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
def validate_create_request_body(data):
    if data["requestor_id"] == None:
        raise ValueError("Requestor ID is required.")
    if data["company_id"] == None:
        raise ValueError("Company ID is required.")
    if data["request_type"] == None:
        raise ValueError("Request Type is required.")
    if data["request_details"] == None:
        raise ValueError("Request Details is required.")
    if data["status"] == None:
        raise ValueError("Status is required.")
    if data["approval_role"] == None:
        raise ValueError("Approval Role is required.")
    #TODO
    return True

@router.post("/create", response_model=None)
def create_approval_requests(
    data: ApprovalRequest,
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in JSON payload and creates a new request.
    Requestor and company ID is embedded into payload.
    Request_detail block can change depending on request type.
    Approval_role refers to who can approve and will get notifications.

    ### Parameters:
    Embedded in body.

    ### Body::
    {
        "requestor_id": "admin1",
        "company_id":"ascenda",
        "request_type": "Transaction",
        "request_details": {
            "amount" : 100,
            "increment" : "False",
            "account_id" : 456789
        },
        "status": "pending",
        "comments": "Optional comment for this particular request",
        "request_title": "Optional title for this particular request",
        "approval_role" : "ADMIN"
    }

    ### Returns:
    Success message.
    
    ### Example:
    #### Request:
    ```
    POST /approval/create
    ```
    #### Response:
    ```
    {
        "logInfo": "ID admin1 created a request with ID 48e7744f-03e8-42cb-af9a-2cf610303f0a for ADMIN approval.",
        "request_id": "48e7744f-03e8-42cb-af9a-2cf610303f0a",
        "message": "Created!"
    }
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        combined_data = {
            **data.model_dump(),
            "requestor_id": requestor_id,
            "company_id": company_id
        }
        validate_create_request_body(combined_data)
        # TODO : Put in validation  that combined_data has request details
        approval_request_repository.create_approval_request(combined_data)
        # TODO: Japheth send email notifications here
        response = {
            "logInfo" : f"ID {combined_data['requestor_id']} created a request with ID {combined_data['uid']} for {combined_data['approval_role']} approval.",
            "request_id" : combined_data['uid'],
            "message": "Created!"
        }
        return response
    except (ValidationError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/update")
def update_approval_request(
    data: ApprovalUpdate,
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in JSON payload and updates an existing request.
    Requestor_id and company_id is embedded into payload.
    Updater must be same as requestor, and request cannot be resolved 
    or expired.

    ### Parameters:
    Embedded in body.

    ### Body::
    {
        "uid": "b47204b2-3310-46d4-bb7d-911a969578a3",
        "company_id": "ascenda",
        "requestor_id": "admin1",
        "request_type": "Transaction",
        "request_details": {
            "account_id": "1221312312sada3",
            "increment" : "False",
            "amount": "100",
        },
        "request_expiry": "2022-11-15T05:16:49.626324",
        "status": "pending"
    }

    ### Returns:
    Success message.
    
    ### Example:
    #### Request:
    ```
    POST /approval/update
    ```
    #### Response:
    ```
    {
        "logInfo": "ID admin1 created a request with ID 48e7744f-03e8-42cb-af9a-2cf610303f0a for ADMIN approval.",
        "result": "Successfully updated request 48e7744f-03e8-42cb-af9a-2cf610303f0a!"
    }
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        combined_data = {
            **data.model_dump(),
            "requestor_id": requestor_id,
            "company_id": company_id
        }
        # Get the original request
        original_request = approval_request_repository.get_approval_request_by_uid(combined_data["company_id"], combined_data['uid'])
        # Check if request exists
        if original_request == None:
            raise ValueError("Request does not exist.")
        # Check if requestID is the same, only the original requestor can update
        if original_request["requestor_id"] != combined_data['requestor_id']:
            raise ValueError("Requestor ID does not match the original requestor ID.")
        # Check if request is pending, only pending requests can be updated
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be updated.")
        # Check if request is expired, only pending requests can be updated
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be updated.")
        
        approval_request_repository.update_approval_request(combined_data)
        response = {
            "logInfo" : f"ID {combined_data['requestor_id']} updated Request ID {combined_data['uid']}, Request Status is now {combined_data['status']}.",
            "result" : f"Successfully updated request {combined_data['uid']}!"
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
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in JSON payload and withdraws an existing request.
    Requestor_id and company_id is embedded into payload.
    Withdrawer must be same as requestor, and request cannot be resolved 
    or expired.

    ### Parameters:
    Embedded in body.

    ### Body::
   {
        "uid": "48e7744f-03e8-42cb-af9a-2cf610303f0a",
        "status" : "withdrawn",
        "approver_id": "admin1",
        "comments" : "Eat Optional",
        "company_id": "ascenda"
    }

    ### Returns:
    Success message.
    
    ### Example:
    #### Request:
    ```
    POST /approval/withdraw
    ```
    #### Response:
    ```
    {
        "logInfo": "ID admin1 withdrew Request ID 48e7744f-03e8-42cb-af9a-2cf610303f0a.",
        "result": "Withdrawn!"    
    }
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try:
        combined_data = {
            **data.model_dump(),
            "requestor_id": requestor_id,
            "company_id": company_id
        }

        original_request = approval_request_repository.get_approval_request_by_uid(combined_data["company_id"], combined_data['uid'])
       
        if original_request == None:
            raise ValueError("Request does not exist.")
        if original_request["requestor_id"] != combined_data["requestor_id"]:
            raise ValueError("Requestor ID does not match the original requestor ID.")
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be withdrawn.")
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be withdrawn.")
        if combined_data["status"] != "withdrawn":
            raise ValueError("Request can only be withdrawn.")
        
        approval_request_repository.withdraw_approval_request(combined_data)

        response = {
            "logInfo" : f"ID {combined_data['requestor_id']} withdrew Request ID {combined_data['uid']}",
            "result" : "Successfuly withdrawn request {combined_data['uid']}."
        }
        return response
    except (ValueError,ValidationError) as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/delete")
def delete_approval_request(
    data: DeleteRequest,
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
):
    """
    Undocumented, but refrain from using
    """
    try:
        combined_data = {
            **data.model_dump(),
            "requestor_id": requestor_id,
            "company_id": company_id
        }
        original_request = approval_request_repository.get_approval_request_by_uid(combined_data['company_id'], combined_data['uid'])
        if original_request == None:
            raise ValueError("Request does not exist.")
        if original_request["requestor_id"] != combined_data['requestor_id']:
            raise ValueError("Requestor ID does not match the original requestor ID.")
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be deleted.")
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be deleted.")
        
        result = approval_request_repository.delete_approval_request(combined_data)
        response = {
            "logInfo" : f"ID {combined_data['requestor_id']} deleted Request ID {combined_data['uid']}",
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
    company_id: str = Header(..., description="Company ID"),
    requestor_id: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in JSON payload and approves or rejects an existing request.
    Approver_id and company_id is embedded into payload.
    Approver must be different as requestor, and request cannot be resolved 
    or expired.

    ### Parameters:
    Embedded in body.

    ### Body::
    {
        "uid": "66c0bef1-ff98-4507-9b58-29908bc49fc26",
        "status" : "approved",
        "approver_id": "abc-567",
        "comments" : "Optional",
        "company_id":"ascenda"
    }

    ### Returns:
    Success message.
    
    ### Example:
    #### Request:
    ```
    POST /approval/create
    ```
    #### Response:
    ```
    {
        "logInfo": "ID admin1 approved Request ID 48e7744f-03e8-42cb-af9a-2cf610303f0a.",
        "result": "Successfully approved Request ID 48e7744f-03e8-42cb-af9a-2cf610303f0a."    
    }
    ```
    ### Errors:
    `400 Bad Request`: The request was invalid or cannot be otherwise served. An accompanying error message will explain further.<br /><br />
    `403 Forbidden`: The request was not made by the approver OR 404 not found (not added yet).<br /><br />
    `500 Internal Server Error`: Generic server error that can occur for various reasons, such as unhandled exceptions in the endpoint, indicates that something went wrong with the server.<br /><br />
    """
    try: 
        #TODO Might be throwing same error for 404 and 403
        combined_data = {
            **data.model_dump(),
            "approver_id": requestor_id,
            "company_id": company_id
        }
        print(combined_data)

        original_request = approval_request_repository.get_approval_request_by_uid(combined_data["company_id"], combined_data["uid"])
        if original_request["requestor_id"] == combined_data["approver_id"]:
            raise ValueError("Requestor cannot be the approver.")
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be updated.")
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be updated.")
        
        if combined_data["status"] == "approved":
            action = "approved"
            # TODO: Japheth do things here
            # Make a call to points storage to update transaction
        elif combined_data["status"] == "rejected":
            action = "rejected"

        #Only update DB if above call to other microservice is successful
        approval_request_repository.approve_or_reject_approval_request(combined_data)

        response = {
            "logInfo" : f"ID {combined_data['approver_id']} {action} Request ID {combined_data['uid']}",
            "result" : f"Successfully {action} Request ID {combined_data['uid']}!"
        }
        return response
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# =================== END: CHECKER requests =======================

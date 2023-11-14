import os
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import ValidationError

from models.ApprovalRequest import ApprovalRequest, ApprovalUpdate, ApprovalResponse, DeleteRequest
from models.approval_request_repository import ApprovalRequestRepository
from controllers.db import initialize_db, create_table_on_first_load, get_db_connection
from controllers.queue import initialize_queue, test_queue
from botocore.exceptions import ClientError
from datetime import datetime
import requests

router = APIRouter(
  prefix = "/approval",
  tags = ["Approvals"],
)

sqs = initialize_queue()

# Get the queue URL from the environment variables if not found, use the local endpoint
queue_url = os.getenv('SQS_URL')

db = get_db_connection()
approval_request_repository = ApprovalRequestRepository(db)

# Get user_ms and point_ms from environment variables
USER_MS = os.getenv('USER_MS')
POINTS_MS = os.getenv('POINTS_MS')
MAKER_CHECKER_PAGE_URL = os.getenv('MAKER_CHECKER_PAGE_URL')

# Print to see if user_ms and point_ms are loaded
print("USER_MS:", USER_MS)
print("POINTS_MS:", POINTS_MS)

class RequestError(Exception):
    def __init__(self, message="Something went wrong with request creation"):
        self.message = message
        super().__init__(self.message)

class MessageError(Exception):
    def __init__(self, message="Message could not be sent"):
        self.message = message
        super().__init__(self.message)

def isExpired(expiry_date:str):
    """
    Takes in a string in isoformat and uses current time 
    to determine if it is expired.
    """
    return datetime.now() > datetime.fromisoformat(expiry_date)

@router.get('/testQueue')
def test():
    test_queue(sqs, queue_url)
    return f"Published test message to queue at: {queue_url}"


# =================== START: GET requests =======================
@router.get("/", response_model=None)
async def get_all_requests(
    companyid: str = None, description="Company ID"
):
    """
    ### Description:
    This endpoint takes in a company ID and returns all requests made in the company table.

    ### Parameters:
    `companyid`: Company ID.<br /><br />

    ### Returns:
    A JSON object containing a list of every requests made in the company.
    If the company ID does not exist, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-all
    ```
    #### Response:
    ```
        [
            {
                "uid": "0428962d-81f3-416d-9e7f-34ff34301251",
                "comments": "Optional comment for this particular request",
                "companyid": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "userid": "admin1",
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
                "companyid": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "userid": "admin1",
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
        if companyid == None:
            raise ValueError("Company ID is required.")
        return approval_request_repository.get_all_approval_requests(companyid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/pending")
def get_pending_requests(
    companyid: str = None, description="Company ID",
    userid: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from the header.
    This returns all pending request that do not originate from the requestor.

    ### Parameters:
    `companyid`: Company ID, taken from header.<br /><br />
    `userid`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of non expired, pending requests
    made by a specific requestor.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-pending
    headers = {
        "companyid": "ascenda",
        "userid": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "uid": "0428962d-81f3-416d-9e7f-34ff34301251",
                "comments": "Optional comment for this particular request",
                "companyid": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "userid": "admin1",
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
                "companyid": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "userid": "admin1",
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
        if companyid == None:
            raise ValueError("Company ID is required.")
        return approval_request_repository.get_pending_approval_requests(companyid, userid)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/resolved")
def get_resolved_by_userid(
    companyid: str = None, description="Company ID",
    userid: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from the header.

    Not pending requests are requests that have been approved, rejected, 
    Expired requests may have status PENDING.

    This will return requests that the user has accepted or rejected.

    ### Parameters:
    `companyid`: Company ID, taken from header.<br /><br />
    `userid`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of not pending requests
    made by a specific requestor.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-not-pending
    headers = {   
        "companyid": "ascenda",
        "userid": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "uid": "0428962d-81f3-416d-9e7f-34ff34301251",
                "comments": "Optional comment for this particular request",
                "companyid": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "userid": "admin1",
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
                "companyid": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "userid": "admin1",
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
        if companyid == None:
            raise ValueError("Company ID is required.")
        if userid:
            return approval_request_repository.get_resolved_requests_by_approver_id(companyid, userid)
        return approval_request_repository.get_non_pending_approval_requests(userid)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/approved")
def get_approved_requests(
    companyid: str = None, description="Company ID",
    userid: str =  Header(..., description="Requestor ID"),
    ):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from the header.

    It will return all approved requests made by the requestor 
    in the company table.

    ### Parameters:
    `companyid`: Company ID, taken from header.<br /><br />
    `userid`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of APPROVED requests
    made by a specific requestor in the company.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-approved
    headers = {
        "companyid": "ascenda",
        "userid": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "comments": "Be civil",
                "companyid": "ascenda",
                "request_type": "Transaction",
                "userid": "admin1",
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
        if companyid == None:
            raise ValueError("Company ID is required.")
        if userid:
            return approval_request_repository.get_approved_approval_requests_by_requestor_id(companyid, userid)
        return approval_request_repository.get_approved_approval_requests(companyid)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rejected")
def get_rejected_requests(
    companyid: str = None, description="Company ID",
    userid: str =  Header(..., description="Requestor ID"),
    ):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from header.

    It will return all rejected requests made by the requestor.

    ### Parameters:
    `companyid`: Company ID, taken from header.<br /><br />
    `userid`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of REJECTED requests
    made by a specific requestor.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-rejected
    headers = {
        "companyid": "ascenda",
        "userid": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "comments": "Be civil",
                "companyid": "ascenda",
                "request_type": "Transaction",
                "userid": "admin1",
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
        if companyid == None:
            raise ValueError("Company ID is required.")
        if userid:
            return approval_request_repository.get_rejected_approval_requests_by_requestor_id(companyid, userid)
        return approval_request_repository.get_rejected_approval_requests(companyid)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/expired")
def get_expired_requests(
    companyid: str = None, description="Company ID",
    userid: str =  Header(..., description="Requestor ID"),
    ):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID from headers.

    It will return all expired requests that are PENDING 
    MADE BY THE REQUESTOR in the company table.

    ### Parameters:
    `companyid`: Company ID, taken from header.<br /><br />
    `userid`: Requestor ID, taken from header.<br /><br />

    ### Returns:
    A JSON object containing a list of expired requests that are still pending
    made by a specific requestor.
    If no requests match, it will return an empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-expired
    headers = {
        "companyid": "ascenda",
        "userid": "admin1"
    }
    ```
    #### Response:
    ```
        [
            {
                "uid": "66c0bef1-ff98-4507-9b58-9908bc49fc26",
                "comments": "Optional comment for this particular request",
                "companyid": "ascenda",
                "request_type": "Transaction",
                "request_title": "Optional title for this particular request",
                "userid": "admin1",
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
        if companyid == None: 
            raise ValueError("Company ID is required.")
        if userid:
            return approval_request_repository.get_expired_approval_requests_by_requestor_id(companyid, userid)
        return approval_request_repository.get_expired_approval_requests(companyid)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/id/{request_id}")
def get_request_by_id(
    request_id: str,
    companyid: str = None, description="Company ID",
):
    """
    ### Description:
    This endpoint takes in a company ID and request ID 
    and returns the request details.

    ### Parameters:
    `companyid`: Company ID.<br /><br />
    `request_id`: Request ID.<br /><br />

    ### Returns:
    A JSON object containing details of the request.
    If request is not found, return 404.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-by-id?companyid=ascenda
    GET /approval/get-by-id?companyid=ascenda&request_id=66c0bef1-ff98-4507-9b58-9908bc49fc26
    ```
    #### Response:
    ```
       {
            "comments": Be Civil",
            "companyid": "ascenda",
            "request_type": "Transaction",
            "userid": "admin1",
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
        if companyid == None:
            raise ValueError("Company ID is required.")
        return approval_request_repository.get_approval_request_by_uid(companyid, request_id)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/requestor")
def get_request_by_userid(
    companyid: str = None, description="Company ID",
    userid: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID 
    and returns all requests made by requestor.

    ### Parameters:
    `companyid`: Company ID.<br /><br />
    `userid`: Requestor ID.<br /><br />

    ### Returns:
    A JSON object containing a list of requests made by the requestor.
    If non, return empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-by-requestor
    headers = {
        "companyid": "ascenda",
        "userid": "admin1"
    }
    ```
    #### Response:
    ```
    [
        {
            "uid": "0428962d-81f3-416d-9e7f-34ff34301251",
            "comments": "Optional comment for this particular request",
            "companyid": "ascenda",
            "request_type": "Transaction",
            "request_title": "Optional title for this particular request",
            "userid": "admin1",
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
        if companyid == None and userid == None:
            raise ValueError("Company ID and userid is required.")
        return approval_request_repository.get_approval_request_by_requestor_id(companyid, userid)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/approver")
def get_request_by_approver_id(
    companyid: str = None, description="Company ID",
    userid: str = Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in a company ID and requestor ID 
    and returns all request responded to by the requestor. 

    ### Parameters:
    `companyid`: Company ID, taken from header.<br /><br />
    `userid`: Requestor ID, taken from header<br /><br />

    ### Returns:
    A JSON object containing a list of requests responded by the requestor.
    If non, return empty list.
    
    ### Example:
    #### Request:
    ```
    GET /approval/get-by-approver
    headers = {
        "companyid": "ascenda",
        "userid": "admin1"
    }
    ```
    #### Response:
    ```
    [
    {
        "comments": "Be civil",
        "companyid": "ascenda",
        "request_type": "Transaction",
        "userid": "admin1",
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
        if companyid == None or userid == None:
            raise ValueError("Company ID and approver_id is required.")
        return approval_request_repository.get_approval_request_by_approver_id(companyid, userid)
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
    if data["companyid"] == None:
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
    userid: str =  Header(..., description="Requestor ID"),
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
        "userid": "admin1",
        "companyid":"ascenda",
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
            "requestor_id": userid,
        }
        validate_create_request_body(combined_data)
        # Put in validation that combined_data has request details
        # verify that user exists by getting userID by email
        print(combined_data['request_type'])
        if combined_data['request_type'] == 'Update User Details':
            verify = requests.get(USER_MS + "/User/getUser",
            headers = {
                "userid": userid
            },
            params={
                "email": combined_data['request_details']['email']
            }).json()
            if verify['data'] == "User Doesn't Exist":
                raise RequestError("user not found")

        elif combined_data['request_type'] == 'Points Update':
            verify = requests.get(POINTS_MS + "/getoneaccount",
            headers = {
                "userid": userid
            },
            params={
                "user_id": combined_data['request_details']['user_id'],
                "company_id": combined_data['request_details']['company_id']
            }).json()
            if verify['code'] == 400:
                raise RequestError("Points account not found")

        create_request = approval_request_repository.create_approval_request(combined_data)
        print("-----------------------")
        print(create_request)
        print("-----------------------")
        roles = combined_data['approval_role']
        # TODO: get url to view requests for particular user from env
        url = MAKER_CHECKER_PAGE_URL
        
        # request for the emails that need to be sent to
        recipients = requests.get(USER_MS + "/User/getUserEmailsByRole",
            headers = {
                "userid": userid
            },
            json=roles
        )
        # Get data
        recipients = recipients.json()["data"]
        # Get email from the recipients.data
        
        if len(recipients) == 0:
            raise RequestError("No recipients found.")
        # Japheth send email notifications here
        try:
            email = sqs.send_message(
                QueueUrl=queue_url,
                DelaySeconds=10,
                MessageAttributes={
                    'fromName': {
                        'DataType': 'String',
                        'StringValue': combined_data['requestor_id']
                    },
                    'subject': {
                        'DataType': 'String',
                        'StringValue': f"Request Approval for {combined_data['request_type']}"
                    },
                    'toEmail': {
                        'DataType': 'String',
                        'StringValue': ",".join(recipients)
                        # 'StringListValue': recipients
                    },
                    'url': {
                        'DataType': 'String',
                        'StringValue': url
                    }
                },
                MessageBody=(
                    'placeholder'
                )
            )
        except Exception as e:
            print(f"error has been caught {e}")
        response = {
            "logInfo" : f"ID {combined_data['requestor_id']} created a request with ID {combined_data['uid']} for {combined_data['approval_role']} approval.",
            "request_id" : combined_data['uid'],
            "message": "Created!"
        }
        return response

    except RequestError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except (ValidationError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/")
def update_approval_request(
    data: ApprovalUpdate,
    userid: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in JSON payload and updates an existing request.
    userid and companyid is embedded into payload.
    Updater must be same as requestor, and request cannot be resolved 
    or expired.

    ### Parameters:
    Embedded in body.

    ### Body::
    {
        "uid": "b47204b2-3310-46d4-bb7d-911a969578a3",
        "companyid": "ascenda",
        "userid": "admin1",
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
            "requestor_id": userid,
        }
        # Get the original request
        original_request = approval_request_repository.get_approval_request_by_uid(combined_data["companyid"], combined_data['uid'])
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
    userid: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in JSON payload and withdraws an existing request.
    userid and companyid is embedded into payload.
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
        "companyid": "ascenda"
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
            "requestor_id": userid,
        }

        original_request = approval_request_repository.get_approval_request_by_uid(combined_data["companyid"], combined_data['uid'])
       
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
    
@router.delete("/")
def delete_approval_request(
    data: DeleteRequest,
    userid: str =  Header(..., description="Requestor ID"),
):
    """
    Undocumented, but refrain from using
    """
    try:
        combined_data = {
            **data.model_dump(),
            "requestor_id": userid,
        }
        original_request = approval_request_repository.get_approval_request_by_uid(combined_data['companyid'], combined_data['uid'])
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

@router.post("/resolve")
def approve_or_reject_approval_request(
    data: ApprovalResponse,
    userid: str =  Header(..., description="Requestor ID"),
):
    """
    ### Description:
    This endpoint takes in JSON payload and approves or rejects an existing request.
    Approver_id and companyid is embedded into payload.
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
        "companyid":"ascenda"
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
            "approver_id": userid,
        }
        original_request = approval_request_repository.get_approval_request_by_uid(combined_data["companyid"], combined_data["uid"])
        if original_request["requestor_id"] == combined_data["approver_id"]:
            raise ValueError("Requestor cannot be the approver.")
        if original_request['status'] != "pending":
            raise ValueError("Request is not pending, cannot be updated.")
        if isExpired(original_request["request_expiry"]):
            raise ValueError("Request is expired, cannot be updated.")
        
        if combined_data["status"] == "approved":
            action = "approved"
            # TODO: Japheth do things here
            headers = { "userid": userid }
            details = original_request['request_details']
            details['withCredentials'] = True
            if original_request['request_type'] == "Points Update":
                # make call to endpoint to change amount
                result = requests.post(POINTS_MS + "/changeBalance", 
                headers = {
                    "userid": userid
                },
                json={
                    "user_id": details['user_id'],
                    "company_id": details['company_id'],
                    "change": int(details['change'])
                }).json()
                print(result)

            elif original_request['request_type'] == "Update User Details":
                # make call to endpoint to change user
                requests.put(USER_MS+"/User/updateUser", headers = headers, json=details)

        elif combined_data["status"] == "rejected":
            action = "rejected"

        #Only update DB if above call to other microservice is successful
        approval_request_repository.approve_or_reject_approval_request(combined_data)

        response = {
            "logInfo" : f"ID {combined_data['approver_id']} {action} Request ID {combined_data['uid']}",
            "result" : f"Successfully {action} Request ID {combined_data['uid']}!"
        }
        return response
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    # except ValueError as e:
    #     raise HTTPException(status_code=404, detail=str(e))
    # except ValidationError as e:
    #     raise HTTPException(status_code=400, detail=str(e))
    # except ClientError as e:
    #     raise HTTPException(status_code=500, detail=str(e))
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
    
# =================== END: CHECKER requests =======================

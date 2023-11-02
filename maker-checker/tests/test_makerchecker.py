from models.approval_request_repository import ApprovalRequestRepository
from botocore.exceptions import ClientError
import unittest.mock as mock
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
import pytest
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)


def get_approval_request_repository():
    return mock.MagicMock(ApprovalRequestRepository)


@patch("controllers.db.initialize_db", return_value=MagicMock())
def initialize_client(mock_initialize_db):
    from main import app
    # Mock initialize_db and ApprovalRequestRepository
    mock_initialize_db.return_value = MagicMock()  # Mock the database initialization

    client = TestClient(app)
    return client


client = initialize_client()

# Mock initialize_db function


def test_healthcheck():
    # Set the return values for the mocked functions if necessary
    response = client.get("/approval/")
    assert response.status_code == 200

# # ================================================= Get Actions =================================================


@patch("views.approvals.approval_request_repository.get_all_approval_requests")
def test_success_get_all_request(mock_get_approval_requests):

    mock_get_approval_requests.return_value = True
    response = client.get(
        "/approval/get-all",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    mock_get_approval_requests.assert_called()
    assert response.status_code == 200


@patch("views.approvals.approval_request_repository.get_all_approval_requests")
def test_failure_missing_company_id_get_all_request(mock_get_approval_requests):

    mock_get_approval_requests.return_value = True
    response = client.get(
        "/approval/get-all",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_all_approval_requests")
def test_failure_client_error_get_all_request(mock_get_approval_requests):

    mock_get_approval_requests.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "/approval/get-all",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        })
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_all_approval_requests")
def test_failure_exception_get_all_request(mock_get_approval_requests):

    mock_get_approval_requests.side_effect = Exception
    response = client.get(
        "/approval/get-all",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 500

# Get Pending


@patch("views.approvals.approval_request_repository.get_pending_approval_requests_by_requestor_id")
def test_success_get_pending_request(mock_get_pending_approval_requests):

    mock_get_pending_approval_requests.return_value = True
    response = client.get(
        "/approval/get-pending",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    mock_get_pending_approval_requests.assert_called()
    assert response.status_code == 200


def test_failure_missing_company_id_get_pending_request():

    response = client.get(
        "/approval/get-pending",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


def test_failure_missing_user_id_get_pending_request():

    response = client.get(
        "/approval/get-pending",
        headers={
            "companyid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_pending_approval_requests_by_requestor_id")
def test_failure_client_error_get_pending_request(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "/approval/get-pending",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        })
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_pending_approval_requests_by_requestor_id")
def test_failure_exception_get_pending_request(mock_function):

    mock_function.side_effect = Exception
    response = client.get(
        "/approval/get-pending",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 500

# Get Not Pending


@patch("views.approvals.approval_request_repository.get_non_pending_approval_requests_by_requestor_id")
def test_success_get_not_pending_request(mock_function):

    mock_function.return_value = True
    response = client.get(
        "approval/get-not-pending",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    mock_function.assert_called()
    assert response.status_code == 200


def test_failure_missing_company_id_get_not_pending_request():

    response = client.get(
        "approval/get-not-pending",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_non_pending_approval_requests_by_requestor_id")
def test_failure_client_error_get_not_pending_request(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "approval/get-not-pending",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        })
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_non_pending_approval_requests_by_requestor_id")
def test_failure_exception_get_not_pending_request(mock_function):

    mock_function.side_effect = Exception
    response = client.get(
        "approval/get-not-pending",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 500

# Get Approved


@patch("views.approvals.approval_request_repository.get_approved_approval_requests_by_requestor_id")
def test_success_get_approved_request(mock_function):

    mock_function.return_value = True
    response = client.get(
        "approval/get-approved",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    mock_function.assert_called()
    assert response.status_code == 200


def test_failure_missing_company_id_get_approved_request():

    response = client.get(
        "approval/get-approved",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_approved_approval_requests_by_requestor_id")
def test_failure_client_error_get_approved_request(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "approval/get-approved",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        })
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_approved_approval_requests_by_requestor_id")
def test_failure_exception_get_approved_request(mock_function):

    mock_function.side_effect = Exception
    response = client.get(
        "approval/get-approved",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 500

# Get Rejected


@patch("views.approvals.approval_request_repository.get_rejected_approval_requests_by_requestor_id")
def test_success_get_rejected_request(mock_function):

    mock_function.return_value = True
    response = client.get(
        "approval/get-rejected",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    mock_function.assert_called()
    assert response.status_code == 200


def test_failure_missing_company_id_get_rejected_request():

    response = client.get(
        "approval/get-rejected",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_rejected_approval_requests_by_requestor_id")
def test_failure_client_error_get_rejected_request(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "approval/get-rejected",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        })
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_rejected_approval_requests_by_requestor_id")
def test_failure_exception_get_rejected_request(mock_function):

    mock_function.side_effect = Exception
    response = client.get(
        "approval/get-rejected",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 500

# Get Expired


@patch("views.approvals.approval_request_repository.get_expired_approval_requests_by_requestor_id")
def test_success_get_expired_request(mock_function):

    mock_function.return_value = True
    response = client.get(
        "approval/get-expired",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    mock_function.assert_called()
    assert response.status_code == 200


def test_failure_missing_company_id_get_expired_request():

    response = client.get(
        "approval/get-expired",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_expired_approval_requests_by_requestor_id")
def test_failure_client_error_get_expired_request(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "approval/get-expired",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        })
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_expired_approval_requests_by_requestor_id")
def test_failure_exception_get_expired_request(mock_function):

    mock_function.side_effect = Exception
    response = client.get(
        "approval/get-expired",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 500

# Get by Request ID


@patch("views.approvals.approval_request_repository.get_approval_request_by_uid")
def test_success_get_by_request_id(mock_function):

    mock_function.return_value = True
    response = client.get(
        "approval/get-by-id",
        headers={
            "companyid": "okx",
            "userid": "123-abc",
        },
        params={
            "request_id": "123-abc"
        }
    )
    mock_function.assert_called()
    assert response.status_code == 200


def test_failure_missing_company_id_get_by_request_id():

    response = client.get(
        "approval/get-by-id",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


def test_failure_missing_request_id_get_by_request_id():

    response = client.get(
        "approval/get-by-id",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        },
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_approval_request_by_uid")
def test_failure_client_error_get_by_request_id(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "approval/get-by-id",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        },
        params={
            "request_id": "123-abc"
        }
    )
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_approval_request_by_uid")
def test_failure_exception_get_by_request_id(mock_function):

    mock_function.side_effect = Exception
    response = client.get(
        "approval/get-by-id",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        },
        params={
            "request_id": "123-abc"
        }
    )
    assert response.status_code == 500

# Get by Requestor ID


@patch("views.approvals.approval_request_repository.get_approval_request_by_requestor_id")
def test_success_get_by_requestor_request(mock_function):

    mock_function.return_value = True
    response = client.get(
        "approval/get-by-requestor",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    mock_function.assert_called()
    assert response.status_code == 200


def test_failure_missing_company_id_get_by_requestor_request():

    response = client.get(
        "approval/get-by-requestor",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


def test_failure_missing_user_id_get_by_requestor_request():

    response = client.get(
        "approval/get-by-requestor",
        headers={
            "companyid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_approval_request_by_requestor_id")
def test_failure_client_error_get_by_requestor_request(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "approval/get-by-requestor",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        })
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_approval_request_by_requestor_id")
def test_failure_exception_get_by_requestor_request(mock_function):

    mock_function.side_effect = Exception
    response = client.get(
        "approval/get-by-requestor",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 500

# Get by Approver ID


@patch("views.approvals.approval_request_repository.get_approval_request_by_approver_id")
def test_success_get_by_approver_request(mock_function):

    mock_function.return_value = True
    response = client.get(
        "approval/get-by-approver",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    mock_function.assert_called()
    assert response.status_code == 200


def test_failure_missing_company_id_get_by_approver_request():

    response = client.get(
        "approval/get-by-approver",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


def test_failure_missing_user_id_get_by_approver_request():

    response = client.get(
        "approval/get-by-approver",
        headers={
            "companyid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.get_approval_request_by_approver_id")
def test_failure_client_error_get_by_approver_request(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")
    response = client.get(
        "approval/get-by-approver",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        })
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.get_approval_request_by_approver_id")
def test_failure_exception_get_by_approver_request(mock_function):

    mock_function.side_effect = Exception
    response = client.get(
        "approval/get-by-approver",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 500

# # ================================================= Post Actions =================================================


@patch("views.approvals.approval_request_repository.create_approval_request")
def test_success_create_request(mock_function):

    mock_function.return_value = {
        "logInfo": f"ID 123-abc created a request with ID XXX for XXX approval.",
        "request_id": "123abc",
        "message": "Created!"
    }
    response = client.post(
        "approval/create",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        },
        json={
            "request_type": "Transaction",
            "request_details": {
                "amount": 100,
                "increment": "False",
                "account_id": 456789
            },
            "status": "pending",
            "approval_role": "ADMIN"
        }
    )
    assert response.status_code == 200


@patch("views.approvals.approval_request_repository.create_approval_request")
def test_failure_missing_company_id_create_request(mock_function):

    mock_function.return_value = {
        "logInfo": f"ID 123-abc created a request with ID XXX for XXX approval.",
        "request_id": "123abc",
        "message": "Created!"
    }
    response = client.post(
        "approval/create",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.create_approval_request")
def test_failure_missing_company_id_create_request(mock_function):

    mock_function.return_value = {
        "logInfo": f"ID 123-abc created a request with ID XXX for XXX approval.",
        "request_id": "123abc",
        "message": "Created!"
    }
    response = client.post(
        "approval/create",
        headers={
            "companyid": "123-abc"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.create_approval_request")
def test_failure_invalid_body_create_request(mock_function):

    mock_function.return_value = {
        "logInfo": f"ID 123-abc created a request with ID XXX for XXX approval.",
        "request_id": "123abc",
        "message": "Created!"
    }
    response = client.post(
        "approval/create",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        },
        json={
            "request_details": {
                "amount": 100,
                "increment": "False",
                "account_id": 456789
            },
            "status": "pending",
            "approval_role": "ADMIN"
        }
    )
    assert response.status_code == 422


@patch("views.approvals.approval_request_repository.create_approval_request")
def test_failure_client_error_create_request(mock_function):

    mock_function.side_effect = ClientError({
        "Error": {
            "Message": "Mocking ClientError"
        }
    }, "Mock")

    response = client.post(
        "approval/create",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        },
        json={
            "request_type": "Transaction",
            "request_details": {
                "amount": 100,
                "increment": "False",
                "account_id": 456789
            },
            "status": "pending",
            "approval_role": "ADMIN"
        }
    )
    assert response.status_code == 500


@patch("views.approvals.approval_request_repository.create_approval_request")
def test_failure_exception_create_request(mock_function):

    mock_function.side_effect = Exception

    response = client.post(
        "approval/create",
        headers={
            "companyid": "okx",
            "userid": "123-abc"
        },
        json={
            "request_type": "Transaction",
            "request_details": {
                "amount": 100,
                "increment": "False",
                "account_id": 456789
            },
            "status": "pending",
            "approval_role": "ADMIN"
        }
    )
    assert response.status_code == 500

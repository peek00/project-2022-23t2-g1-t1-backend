import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import unittest.mock as mock
from botocore.exceptions import ClientError

from models.approval_request_repository import ApprovalRequestRepository

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
    """
    Test that get_all_approval_requests is called and returns a 200 status code.
    """
    mock_get_approval_requests.return_value = True
    response = client.get("/approval/get-all?company_id=test")
    mock_get_approval_requests.assert_called()
    assert response.status_code == 200

@patch("views.approvals.approval_request_repository.get_all_approval_requests")
def test_failure_missing_company_id_get_all_request(mock_get_approval_requests):
    """
    Test that missing company_id returns a 400 status code.
    """
    mock_get_approval_requests.return_value = True
    response = client.get("/approval/get-all")
    assert response.status_code == 400

@patch("views.approvals.approval_request_repository.get_all_approval_requests")
def test_failure_client_error_get_all_request(mock_get_approval_requests):
    """
    Test that ClientError returns a 500 status code.
    """
    mock_get_approval_requests.side_effect = ClientError({
        "Error" : {
            "Message" : "Mocking ClientError"
        }
    }, "Mock")
    response = client.get("/approval/get-all?company_id=test")
    assert response.status_code == 500

@patch("views.approvals.approval_request_repository.get_all_approval_requests")
def test_failuer_exception_get_all_request(mock_get_approval_requests):
    """
    Test that Exception returns a 500 status code.
    """
    mock_get_approval_requests.side_effect = Exception
    response = client.get("/approval/get-all?company_id=test")
    assert response.status_code == 500

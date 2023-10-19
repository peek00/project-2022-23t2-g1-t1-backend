import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import unittest.mock as mock

from main import app
from models.approval_request_repository import ApprovalRequestRepository


def get_approval_request_repository():
    approval_request_repository = mock.MagicMock(ApprovalRequestRepository)
    return approval_request_repository


def initialize_client():
    client = TestClient(app)
    return client

client = initialize_client()

# Mock initialize_db function
@patch('views.approvals.initialize_db')
def test_healthcheck(mock_initialize_db):
    # Set the return values for the mocked functions if necessary
    mock_initialize_db.return_value = 'mocked_db'
    with TestClient(app) as client:
        response = client.get("/approval/")
        assert response.status_code == 200
        assert response.json() == {"message": "Welcome to the approvals API! Endpoint is working."}

# ================================================= Approval Actions =================================================

@patch("views.approvals.approval_request_repository.create_approval_request")
def test_success_create_approval_requests(mock_create_approval_request):
    mock_create_approval_request.return_value = True
    response = client.post(
        "/approval/create",
        json={
            "requestor_id": "abc-12345",
            "request_type": "Transaction",
            "request_details": {
                "amount" : 100,
                "increment" : False,
                "account_id" : 456789
            },
            "status": "pending",
            "comments": "Optional comment for this particular request",
            "request_title": "Optional title for this particular request",
            "approval_role" : "ADMIN"
        }
    )
    mock_create_approval_request.assert_called()
    assert response.status_code == 200
if __name__ == "__main__":
    pytest.main()
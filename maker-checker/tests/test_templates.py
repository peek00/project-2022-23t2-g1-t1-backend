import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Sample test case


@pytest.fixture
def client():
    with patch("controllers.db.create_table_on_first_load", return_value=MagicMock()):
        from main import app
        # Mock the database initialization
        client = TestClient(app)
        return client

# ============================ GET templates/===============================


@patch("views.templates.template_repository.get_all_templates", return_value=MagicMock())
def test_success_get_templates(mock_func, client):
    mock_func.return_value = True
    response = client.get(
        "/templates/",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 200


@patch("views.templates.template_repository.get_specific_template", return_value=MagicMock())
def test_success_get_template(mock_func, client):
    mock_func.return_value = True
    response = client.get(
        "/templates?uid=123",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        }
    )
    assert response.status_code == 200


def test_unauthorized_get_templates(client):
    response = client.get(
        "/templates/",
    )
    assert response.status_code == 401

# ============================ POST templates/ ===============================


@patch("views.templates.template_repository.create_template")
@patch("views.templates.permission_repository.add_permission")
def test_create_template(mock_add, mock_create, client):
    mock_create.return_value = True
    mock_add.return_value = True

    response = client.post(
        "/templates",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        },
        json={
            "allowed_approvers": [
                "Owner"
            ],
            "allowed_requestors": [
                "Engineer"
            ],
            "details": {
                "increment":  "bool",
                "amount": "int",
                "account_id": "str"
            },
            "desc": "Update points for users",
            "type": "Update Points"
        }
    )
    assert mock_create.called
    assert mock_add.called
    assert response.status_code == 201


@patch("views.templates.template_repository.create_template", return_value=MagicMock())
@patch("views.templates.permission_repository.add_permission", return_value=MagicMock())
def test_empty_approver_create_template(mock_add, mock_create, client):
    mock_create.return_value = True
    mock_add.return_value = True

    response = client.post(
        "/templates",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        },
        json={
            "allowed_approvers": [
            ],
            "allowed_requestors": [
                "Engineer"
            ],
            "details": {
                "increment":  "bool",
                "amount": "int",
                "account_id": "str"
            },
            "desc": "Update points for users",
            "type": "Update Points"
        }
    )
    assert response.status_code == 400
    assert response.json() == {
        "detail": "Allowed requestors and approvers cannot be empty."}


@patch("views.templates.template_repository.create_template", return_value=MagicMock())
@patch("views.templates.permission_repository.add_permission", return_value=MagicMock())
def test_empty_requestor_create_template(mock_add, mock_create, client):
    mock_create.return_value = True
    mock_add.return_value = True

    response = client.post(
        "/templates",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        },
        json={
            "allowed_approvers": [
                "Engineer"
            ],
            "allowed_requestors": [
            ],
            "details": {
                "increment":  "bool",
                "amount": "int",
                "account_id": "str"
            },
            "desc": "Update points for users",
            "type": "Update Points"
        }
    )
    assert response.status_code == 400
    assert response.json() == {
        "detail": "Allowed requestors and approvers cannot be empty."}


@patch("views.templates.template_repository.create_template", return_value=MagicMock())
@patch("views.templates.permission_repository.add_permission", return_value=MagicMock())
def test_empty_details_create_template(mock_add, mock_create, client):
    mock_create.return_value = True
    mock_add.return_value = True

    response = client.post(
        "/templates",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        },
        json={
            "allowed_approvers": [
                "Engineer"
            ],
            "allowed_requestors": [
                "Engineer"
            ],
            "details": {
            },
            "desc": "Update points for users",
            "type": "Update Points"
        }
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Details cannot be empty."}


def test_no_companyid_create_template(client):
    response = client.post(
        "/templates",
        headers={
            "companyid": "123-abc",
        },
    )
    assert response.status_code == 422


def test_no_userid_create_template(client):
    response = client.post(
        "/templates",
        headers={
            "userid": "123-abc",
        },
    )
    assert response.status_code == 422

# ============================ PUT templates/ ===============================
@patch("views.templates.template_repository.update_template")
@patch("views.templates.template_repository.get_specific_template")
def test_update_template(mock_get, mock_update, client):
    mock_get.return_value = True
    mock_update.return_value = True

    response = client.put(
        "/templates",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        },
        json={
            "uid": "123",
            "allowed_approvers": [
                "Owner",
                "Engineer"
            ],
            "allowed_requestors": [
                "Owner",
                "Admin"
            ],
            "details": {
                "increment":  "bool",
                "amount": "int",
                "account_id": "str"
            },
            "desc": "Update points for users",
            "type": "Points Update"
        }
    )

    assert response.status_code == 200

@patch("views.templates.template_repository.get_specific_template")
def test_not_found_update_template(mock_get, client):
    mock_get.return_value = []

    response = client.put(
        "/templates",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        },
        json={
            "uid": "123",
            "allowed_approvers": [
                "Owner",
                "Engineer"
            ],
            "allowed_requestors": [
                "Owner",
                "Admin"
            ],
            "details": {
                "increment":  "bool",
                "amount": "int",
                "account_id": "str"
            },
            "desc": "Update points for users",
            "type": "Points Update"
        }
    )

    assert response.status_code == 404

def test_no_companyid_update_template(client):
    response = client.put(
        "/templates",
        headers={
            "userid": "123-abc"
        }
    )
    assert response.status_code == 422

def test_no_userid_update_template(client):
    response = client.put(
        "/templates",
        headers={
            "companyid": "123-abc"
        }
    )
    assert response.status_code == 422

# ============================ DELETE templates/ ===============================
@patch("views.templates.template_repository.delete_template")
@patch("views.templates.template_repository.get_specific_template")
def test_delete_template(mock_get, mock_delete, client):
    mock_get.return_value = True
    mock_delete.return_value = True

    response = client.delete(
        "/templates?uid=123",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        },
    )
    assert response.status_code == 200

def test_no_id_delete_template(client):
    response = client.delete(
        "/templates",
        headers={
            "companyid": "123-abc",
            "userid": "123-abc"
        },
    )
    assert response.status_code == 422

def test_no_userid_delete_template(client):
    response = client.delete(
        "/templates?uid=123",
        headers={
            "companyid": "123-abc",
        },
    )
    assert response.status_code == 401

def test_no_companyid_delete_template(client):
    response = client.delete(
        "/templates?uid=123",
        headers={
            "userid": "123-abc"
        },
    )
    assert response.status_code == 401

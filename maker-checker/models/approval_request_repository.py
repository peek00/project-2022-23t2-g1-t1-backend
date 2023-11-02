from botocore.exceptions import ClientError
from boto3.resources.base import ServiceResource
from boto3.dynamodb.conditions import Key, Attr  # Import Key and Attr
from models.ApprovalRequest import ApprovalResponse, DeleteRequest
from datetime import datetime

class ApprovalRequestRepository:
    def __init__(self, db: ServiceResource) -> None:
        # db resource will be injected when this repository is created in the main.py
        self.__db = db

    def get_all_approval_requests(self, company_id: str):
        # referencing the "approval_request" table
        table = self.__db.Table('approval_request')
        response = table.scan(
            FilterExpression=Attr("company_id").eq(company_id)
        )
        # Extract the items from the response
        items = response.get('Items', [])

        return items  # return data

    def get_pending_approval_requests(self, company_id: str):
        try:
            table = self.__db.Table('approval_request')

            current_time = str(datetime.now().isoformat())

            response = table.scan(
                FilterExpression=Attr("status").eq('pending')
                & Attr("company_id").eq(company_id)
                & Attr("request_expiry").gt(current_time)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_approved_approval_requests(self, company_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("status").eq('approved')
                & Attr("company_id").eq(company_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])
        
    def get_approved_approval_requests_by_requestor_id(self, company_id: str, requestor_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("status").eq('approved')
                & Attr("company_id").eq(company_id)
                & Attr("requestor_id").eq(requestor_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_rejected_approval_requests(self, company_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("status").eq('rejected')
                & Attr("company_id").eq(company_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_rejected_approval_requests_by_requestor_id(self, company_id: str, requestor_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("status").eq('rejected')
                & Attr("company_id").eq(company_id)
                & Attr("requestor_id").eq(requestor_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_expired_approval_requests(self, company_id: str):
        # Check if item is not expired
        try:
            table = self.__db.Table('approval_request')

            current_time = str(datetime.now().isoformat())

            # Define the filter expression to check for pending items and not expired items
            response = table.scan(
                FilterExpression=Attr("status").eq('pending')
                & Attr("request_expiry").lt(current_time)
                & Attr("company_id").eq(company_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])
        
    def get_expired_approval_requests_by_requestor_id(self, company_id: str, requestor_id: str):
        # Check if item is not expired
        try:
            table = self.__db.Table('approval_request')

            current_time = str(datetime.now().isoformat())

            # Define the filter expression to check for pending items and not expired items
            response = table.scan(
                FilterExpression=Attr("status").eq('pending')
                & Attr("request_expiry").lt(current_time)
                & Attr("company_id").eq(company_id)
                & Attr("requestor_id").eq(requestor_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])


    def get_approval_request_by_uid(self, company_id: str, uid: str):
        try:
            table = self.__db.Table('approval_request')
            item = table.get_item(
                Key={
                    'company_id': company_id,
                    'uid': uid
                }
            ).get('Item')
            if item == None:
                raise ValueError("Approval request not found")
            return item
        except ValueError as e:
            raise ValueError(e)
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_approval_request_by_requestor_id(self, company_id: str, requestor_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("requestor_id").eq(requestor_id)
                & Attr("company_id").eq(company_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_approval_request_by_approver_id(self, company_id: str, approver_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("approver_id").eq(approver_id)
                & Attr("company_id").eq(company_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_pending_approval_requests_by_requestor_id(self, company_id: str, approver_id: str):
        try:
            table = self.__db.Table('approval_request')

            current_time = str(datetime.now().isoformat())
            response = table.scan(
                FilterExpression=Attr("requestor_id").eq(
                    approver_id) & Attr("status").eq('pending')
                & Attr("company_id").eq(company_id)
                & Attr("request_expiry").gt(current_time)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_non_pending_approval_requests(self, company_id: str,):
        try:
            table = self.__db.Table('approval_request')
            current_time = str(datetime.now().isoformat())
            response = table.scan(
                FilterExpression=Attr("status").ne('pending')
                & Attr("company_id").eq(company_id)
                & Attr("request_expiry").gt(current_time)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_non_pending_approval_requests_by_requestor_id(self, company_id: str, approver_id: str):
        try:
            table = self.__db.Table('approval_request')
            current_time = str(datetime.now().isoformat())
            response = table.scan(
                FilterExpression=Attr("requestor_id").eq(approver_id)
                & Attr("status").ne('pending')
                & Attr("company_id").eq(company_id)
                & Attr("request_expiry").gt(current_time)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def create_approval_request(self, approval_request: dict):
        try:
            table = self.__db.Table('approval_request')
            response = table.put_item(Item=approval_request)
            return response
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def update_approval_request(self,
                                data: dict
                                ):
        """
        Update function to be called only by requestor
        """
        # Retrieve the current data object from the database by UID
        try:
            table = self.__db.Table('approval_request')
            item = table.get_item(
                Key={
                    'company_id': data["company_id"],
                    'uid': data["uid"]
                }
            ).get('Item')

            # Update the item
            if item == None:
                raise ValueError("Approval request not found")
            for key, value in data.items():
                if value == None:
                    pass
                else:
                    item[key] = value

            response = table.put_item(Item=item)
            return response
        except ValueError as e:
            raise ValueError(e)
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def approve_or_reject_approval_request(self, data: ApprovalResponse):
        """
        Approve a response
        """
        try:
            table = self.__db.Table('approval_request')
            item = table.get_item(
                Key={
                    'company_id': data["company_id"],
                    'uid': data["uid"]
                }
            ).get('Item')
            if item == None:
                raise ValueError("Approval request not found")
            # Update the item
            for key, value in data.items():
                # Can add additional validation before
                item[key] = value
            response = table.put_item(Item=item)
            return response
        except ValueError as e:
            raise ValueError(e)
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def withdraw_approval_request(self, data: ApprovalResponse):
        """
        Changes an approval object request to be withdrawn.
        Can only be done by original requestor.
        An expired, approved, rejected request cannot be withdrawn.
        """
        try:
            table = self.__db.Table('approval_request')
            item = table.get_item(
                Key={
                    'company_id': data["company_id"],
                    'uid': data["uid"]
                }
            ).get('Item')
            if item == None:
                raise ValueError("Approval request not found")
            # Update the item
            for key, value in data.items():
                # Can add additional validation before
                item[key] = value

            # Send out call to do whatever the request contains
            response = table.put_item(Item=item)
            return response
        except ValueError as e:
            raise ValueError(e)
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def delete_approval_request(self, data: DeleteRequest):
        """
        Not sure if we will be using this function or just the withdraw function
        """
        try:
            table = self.__db.Table('approval_request')
            # Send out call to do whatever the request contains
            response = table.delete_item(
                Key={
                    'company_id': data["company_id"],
                    'uid': data["uid"]
                }
            )
            return response
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

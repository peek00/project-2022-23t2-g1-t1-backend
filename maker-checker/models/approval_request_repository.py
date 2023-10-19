from botocore.exceptions import ClientError
from boto3.resources.base import ServiceResource
from boto3.dynamodb.conditions import Key, Attr  # Import Key and Attr
from models.ApprovalRequest import ApprovalResponse, DeleteRequest
from datetime import datetime

class ValidationError(Exception):
    pass

class ApprovalRequestRepository:
    def __init__(self, db: ServiceResource) -> None:
        # db resource will be injected when this repository is created in the main.py
        self.__db = db

    def get_all_approval_requests(self):
        # referencing the "approval_request" table
        table = self.__db.Table('approval_request')
        response = table.scan()

        # Extract the items from the response
        items = response.get('Items', [])

        return items  # return data

    def get_pending_approval_requests(self):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("status").eq('pending')
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_approved_approval_requests(self):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("status").eq('approved')
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_rejected_approval_requests(self):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("status").eq('rejected')
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def get_expired_approval_requests(self):
        # Check if item is not expired
        # Untested 
        try:
            table = self.__db.Table('approval_request')
            
            # Get the current datetime
            current_time = datetime.now().isoformat()
            
            # Define the filter expression to check for pending items and not expired items
            filter_expression = Attr("status").eq('pending') & Attr("request_expiry").gt(current_time)
            
            response = table.scan(FilterExpression=filter_expression)
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])\
            
    def get_approval_request_by_uid(self, uid: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.get_item(Key={'uid': uid})
            item = response.get('Item')
            return item
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])
        
    def get_approval_request_by_requestor_id(self, requestor_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("requestor_id").eq(requestor_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])
    
    def get_approval_request_by_approver_id(self, approver_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("approver_id").eq(approver_id)
            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])
        
    def get_pending_approval_requests_by_requestor_id(self, approver_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("requestor_id").eq(approver_id) & Attr("status").eq('pending')

            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])
        
    def get_non_pending_approval_requests_by_requestor_id(self, approver_id: str):
        try:
            table = self.__db.Table('approval_request')
            response = table.scan(
                FilterExpression=Attr("requestor_id").eq(approver_id) & Attr("status").ne('pending')

            )
            items = response.get('Items', [])
            return items
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def create_approval_request(self, approval_request: dict):
        try:
            table = self.__db.Table('approval_request')
            response = table.put_item(Item=approval_request.dict())
            return response                         #
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
            item = table.get_item(Key={'uid': data.uid}).get('Item')

            # Compare the requestor uuid with the one in the database
            if item.get('requestor_id') != data.requestor_id:
                raise ValidationError("Only original requestor can update request!")
            
            # Update the item
            for key, value in data.dict().items():
                # Can add additional validation before
                if value == None:
                    pass
                else:
                    item[key] = value
            response = table.put_item(Item=item)
            return response
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def approve_or_reject_approval_request(self, data:ApprovalResponse):
        """
        Approve a response
        """
        try:
            table = self.__db.Table('approval_request')
            item = table.get_item(Key={'uid': data.uid}).get('Item')

            # Check if requestor is the same as approver
            if item.get('requestor_id') == data.approver_id:
                raise ValidationError("Requestor cannot be the same as the approver!")
            
            # Check if request has been approved / rejected / etc
            if item.get('status') != 'pending':
                raise ValidationError("Request has already been resolved!")

            # Check if item is not expired
            if item.get('request_expiry') < data.resolution_at:
                raise ValidationError("Request has expired!")

            # Update the item
            for key, value in data.model_dump().items():
                # Can add additional validation before
                item[key] = value

            # Send out call to do whatever the request contains
            if item.get('status') == 'approved':
                # TODO: Japheth do things here
                # Make a call to points storage to update transaction
                pass
            response = table.put_item(Item=item)
            return response
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
            item = table.get_item(Key={'uid': data.uid}).get('Item')

            # Check if requestor is the same as approver
            if item.get('requestor_id') != data.approver_id:
                raise ValidationError("Withdrawer must be the same as the requestor!")

            # Check if request has been approved / rejected / etc
            if item.get('status') != 'pending':
                raise ValidationError("Request has already been resolved!")

            # Check if item is not expired
            if item.get('request_expiry') < data.resolution_at:
                raise ValidationError("Request has expired!")

            # Confirm its a withdraw status
            if data.status != 'withdrawn':
                # Do something
                raise ValidationError("Incorrect status type for request!")
            # Update the item
            for key, value in data.model_dump().items():
                # Can add additional validation before
                item[key] = value

            # Send out call to do whatever the request contains
            response = table.put_item(Item=item)
            return response
    
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

    def delete_approval_request(self, data:DeleteRequest):
        """
        Not sure if we will be using this function or just the withdraw function
        """
        try:
            table = self.__db.Table('approval_request')

            # Check if deleter is the requestor
            item = table.get_item(Key={'uid': data.uid}).get('Item')
            # Compare the requestor uuid with the one in the database
            if item.get('requestor_id') == data.approver_id:
                raise ValidationError("Only original requestor can delete request!")

            # Send out call to do whatever the request contains
            response = table.delete_item(Key={'uid': data.uid})
            return response
        except ClientError as e:
            raise ValueError(e.response['Error']['Message'])

from botocore.exceptions import ClientError
from boto3.resources.base import ServiceResource
from boto3.dynamodb.conditions import Key, Attr  # Import Key and Attr


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
        pass
        # try:
        #     table = self.__db.Table('approval_request')
        #     response = table.scan(
        #         FilterExpression=Attr("status").eq('rejected')
        #     )
        #     items = response.get('Items', [])
        #     return items
        # except ClientError as e:
        #     raise ValueError(e.response['Error']['Message'])

    def create_approval_request(self, approval_request: dict):
        table = self.__db.Table('approval_request')
        response = table.put_item(Item=approval_request.dict())
        return response                         #

    def update_approval_request(self,
                       data: dict
                       ):
        """
        Update function to be called only by requestor
        """
        # Retrieve the current data object from the database by UID
        # Compare the requestor uuid with the one in the database
        # make changes
        table = self.__db.Table('approval_request')
        item = table.get_item(Key={'uid': data.request_uid}).get('Item')
        # Check if requestor is the same
        assert item.get('requestor_id') == data.requestor_id, "Requestor is not the same as the original requestor!"
        # Update the item
        for key, value in data.dict().items():
            # Can add additional validation before
            item[key] = value
        response = table.put_item(Item=item)
        return response


    # def delete_recipe(self, uid: str):
    #     table = self.__db.Table('Recipes')      # referencing to table Recipes
    #     response = table.delete_item(           # delete recipe using uuid
    #         Key={'uid': uid}
    #     )
    #     return response

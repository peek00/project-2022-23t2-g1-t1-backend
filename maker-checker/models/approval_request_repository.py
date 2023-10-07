from botocore.exceptions import ClientError
from boto3.resources.base import ServiceResource
from boto3.dynamodb.conditions import Key, Attr  # Import Key and Attr


class ApprovalRequestRepository:
    def __init__(self, db: ServiceResource) -> None:
        self.__db = db          # db resource will be injected when this repository is created in the main.py

    def get_all_approval_requests(self):
        table = self.__db.Table('approval_request')  # referencing the "approval_request" table
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
        table = self.__db.Table('approval_request')  # referencing to table Recipes
        response = table.put_item(Item=approval_request.dict())  # create recipe

        return response                         # return response from dynamodb

    # def update_recipe(self, recipe: dict):
    #     table = self.__db.Table('Recipes')      # referencing to table Recipes
    #     response = table.update_item(           # update single item
    #         Key={'uid': recipe.get('uid')},     # using partition key specifying which attributes will get updated
    #         UpdateExpression="""                
    #             set
    #                 author=:author,
    #                 description=:description,
    #                 ingredients=:ingredients,
    #                 title=:title,
    #                 steps=:steps
    #         """,
    #         ExpressionAttributeValues={         # values defined in here will get injected to update expression
    #             ':author': recipe.get('author'),
    #             ':description': recipe.get('description'),
    #             ':ingredients': recipe.get('ingredients'),
    #             ':title': recipe.get('title'),
    #             ':steps': recipe.get('steps')
    #         },
    #         ReturnValues="UPDATED_NEW"          # return the newly updated data point
    #     )
    #     return response

    # def delete_recipe(self, uid: str):
    #     table = self.__db.Table('Recipes')      # referencing to table Recipes
    #     response = table.delete_item(           # delete recipe using uuid
    #         Key={'uid': uid}
    #     )
    #     return response
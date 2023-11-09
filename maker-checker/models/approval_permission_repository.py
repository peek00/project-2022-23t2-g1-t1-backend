from botocore.exceptions import ClientError
from boto3.resources.base import ServiceResource
from boto3.dynamodb.conditions import Key, Attr  # Import Key and Attr
from datetime import datetime
from typing import List

from models.Permission import Permission

class ApprovalRequestPermissionRepo:
    def __init__(self, db: ServiceResource):
        self.__db = db
        self.__table = self.__db.Table('request_permission')

    def get_all_permission(self):
        """
        Get all permission.
        """
        response = self.__table.scan()
        return response['Items']
    
    def get_specific_permission(self, role:str):
        """
        Given a role, returns the permission associated.
        If not found, return an empty list.
        """
        response = self.__table.query(
            KeyConditionExpression=Key('role').eq(role)
        )
        return response['Items']
    
    def create_permission(self, userid:str, permission:Permission):
        try:
            response = self.__table.put_item(
                Item={
                    'role': permission.role,
                    'approved_actions': permission.approved_actions,
                    'created_at': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    'created_by': userid,
                }
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])

    def update_permissions(self, userid, roles, action):
        try:
            updated_responses = []
            for role in roles:
                permission = self.get_specific_permission(role)

                # Create new permission if it doesn't exist
                if not permission:
                    permission = Permission(
                        role=role,
                        approved_actions=[action]
                    )
                    self.create_permission(userid, permission)
                else:
                    permission = permission[0]

                    if action in permission['approved_actions']:
                        permission['approved_actions'].remove(action)
                    else:
                        permission['approved_actions'].append(action)

                    response = self.__table.update_item(
                        Key={
                            'role': role
                        },
                        UpdateExpression="set approved_actions=:p, updated_at=:u, updated_by=:i",
                        ExpressionAttributeValues={
                            ':p': permission['approved_actions'],
                            ':u': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                            ':i': userid
                        },
                        ReturnValues="ALL_NEW"
                    )
                    updated_responses.append(response)

            return updated_responses
        except ClientError as e:
            print(e.response['Error']['Message'])
    
    # def update_permission(self, userid:str, permission:Permission):
    #     """
    #     Involves replacing the roles. Should use add if you want to just add.
    #     """
    #     try:
    #         response = self.__table.update_item(
    #             Key={
    #                 'role': permission.role
    #             },
    #             UpdateExpression="set approved_actions=:p, updated_at=:u, updated_by=:i",
    #             ExpressionAttributeValues={
    #                 ':p': permission.approved_actions,
    #                 ':u': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
    #                 ':i': userid
    #             },
    #             ReturnValues="UPDATED_NEW"
    #         )
    #         return response
    #     except ClientError as e:
    #         print(e.response['Error']['Message'])
    
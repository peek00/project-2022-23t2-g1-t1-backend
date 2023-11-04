from botocore.exceptions import ClientError
from boto3.resources.base import ServiceResource
from boto3.dynamodb.conditions import Key, Attr  # Import Key and Attr
from datetime import datetime

from models.Permission import Permission

class ApprovalRequestPermissionRepo:
    def __init__(self, db: ServiceResource):
        self.__db = db
        self.__table = self.__db.Table('request_permission')

    def get_all_permission(self, companyid:str):
        """
        Get all permission by companyid
        """
        response = self.__table.query(
            KeyConditionExpression=Key('companyid').eq(companyid)
        )
        return response['Items']
    
    def get_specific_permission(self, companyid:str, role:str):
        """
        Given a role and companyid, returns the permission associated.
        If not found, return an empty list.
        """
        response = self.__table.query(
            KeyConditionExpression=Key('companyid').eq(companyid) & Key('role').eq(role)
        )
        return response['Items']
    
    def create_permission(self, companyid:str, userid:str, permission:Permission):
        try:
            response = self.__table.put_item(
                Item={
                    'companyid': companyid,
                    'role': permission.role,
                    'approved_actions': permission.approved_actions,
                    'created_at': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    'created_by': userid,
                }
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])

    def update_permission(self, companyid:str, userid:str, permission:Permission):
        """
        Involves appending the new roles
        """
        try:

            original_permission = self.__table.query(
                KeyConditionExpression=Key('companyid').eq(companyid) & Key('role').eq(permission.role)
            )
            original_approved_actions = original_permission['Items'][0]['approved_actions']
            new_approved_actions = original_approved_actions + permission.approved_actions

            response = self.__table.update_item(
                Key={
                    'companyid': companyid,
                    'role': permission.role
                },
                UpdateExpression="set approved_actions=:p, updated_at=:u, updated_by=:i",
                ExpressionAttributeValues={
                    ':p': new_approved_actions,
                    ':u': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    ':i': userid
                },
                ReturnValues="UPDATED_NEW"
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])

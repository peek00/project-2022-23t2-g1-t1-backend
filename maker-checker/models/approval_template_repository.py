from botocore.exceptions import ClientError
from boto3.resources.base import ServiceResource
from boto3.dynamodb.conditions import Key, Attr  # Import Key and Attr
from datetime import datetime
from models.Templates import Templates

class ApprovalRequestTemplateRepo:
    def __init__(self, db: ServiceResource):
        self.__db = db
        self.__table = self.__db.Table('request_template')

    def get_all_templates(self):
        """
        Get all templates
        """
        response = self.__table.scan()
        return response['Items']
    
    def get_specific_template(self, uid:str):
        """
        Given a uid a returns the template associated.
        If not found, return an empty list.
        """
        response = self.__table.query(
            KeyConditionExpression=Key('uid').eq(uid)
        )
        return response['Items']
    
    def create_template(self,userid:str, template:Templates):
        try:
            response = self.__table.put_item(
                Item={
                    'uid': template.uid,
                    'type': template.type,
                    'allowed_requestors' : template.allowed_requestors,
                    'allowed_approvers': template.allowed_approvers,
                    'details': template.details,
                    'created_at': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    'created_by': userid,
                    'desc': template.desc
                }
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])

    def update_template(self, userid:str, template:Templates):
        try:
            response = self.__table.update_item(
                Key={
                    'uid': template.uid
                },
                UpdateExpression="set #t=:a, allowed_requestors=:r, allowed_approvers=:p, details=:d, #desc=:desc ,updated_at=:u, updated_by=:b",
                ExpressionAttributeValues={
                    ':a': template.type,
                    ':r': template.allowed_requestors,
                    ':p': template.allowed_approvers,
                    ':d': template.details,
                    ':desc': template.desc,
                    ':u': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    ':b': userid
                },
                ExpressionAttributeNames={
                    '#t': 'type',  # Use #t as a placeholder for the 'type' attribute
                    '#desc': 'desc'  # Use #desc as a placeholder for the 'desc' attribute
                },
                ReturnValues="UPDATED_NEW"
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])
    def update_template_allowed_requestor(self, uid:str, role:str):
        try:
            response = self.__table.update_item(
                Key={
                    'uid': uid
                },
                UpdateExpression="set allowed_requestors=:r, updated_at=:u, updated_by=:b",
                ExpressionAttributeValues={
                    ':r': role,
                    ':u': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    ':b': uid
                },
                ReturnValues="UPDATED_NEW"
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])
    def delete_template(self,uid:str):
        try:
            response = self.__table.delete_item(
                Key={
                    'uid': uid
                }
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])

    def get_allowed_requestors(self, role:list[str]):
        try:
            if len(role) == 1:
                response = self.__table.scan(
                    FilterExpression=Attr("allowed_requestors").contains(role[0])
                )
            else:
                filter = Attr("allowed_requestors").contains(role[0])
                for i in range(1, len(role)):
                    filter = filter | Attr("allowed_requestors").contains(role[i])
                response = self.__table.scan(
                    FilterExpression=filter
                )
            return response['Items']
        except ClientError as e:
            print(e.response['Error']['Message'])
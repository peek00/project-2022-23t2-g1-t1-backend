from botocore.exceptions import ClientError
from boto3.resources.base import ServiceResource
from boto3.dynamodb.conditions import Key  # Import Key and Attr
from datetime import datetime
from models.Templates import Templates

class ApprovalRequestTemplateRepo:
    def __init__(self, db: ServiceResource):
        self.__db = db
        self.__table = self.__db.Table('request_template')

    def get_all_templates(self, companyid:str):
        """
        Get all templates by companyid
        """
        response = self.__table.query(
            KeyConditionExpression=Key('companyid').eq(companyid)
        )
        return response['Items']
    
    def get_specific_template(self, companyid:str, uid:str):
        """
        Given a uid and companyid, returns the template associated.
        If not found, return an empty list.
        """
        response = self.__table.query(
            KeyConditionExpression=Key('companyid').eq(companyid) & Key('uid').eq(uid)
        )
        return response['Items']
    
    def create_template(self, companyid:str, userid:str, template:Templates):
        try:
            response = self.__table.put_item(
                Item={
                    'companyid': companyid,
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

    def update_template(self, companyid:str, userid:str, template:Templates):
        try:
            response = self.__table.update_item(
                Key={
                    'companyid': companyid,
                    'uid': template.uid
                },
                UpdateExpression="set type=:a, allowed_requestors=:r, allowed_approvers=:p, details=:d, desc=:desc updated_at=:u, updated_by=:b",
                ExpressionAttributeValues={
                    ':a': template.action,
                    ':r': template.allowed_requestors,
                    ':p': template.allowed_approvers,
                    ':d': template.details,
                    ':desc': template.desc,
                    ':u': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    ':b': userid
                },
                ReturnValues="UPDATED_NEW"
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])
            
    def delete_template(self, companyid:str, uid:str):
        try:
            response = self.__table.delete_item(
                Key={
                    'companyid': companyid,
                    'uid': uid
                }
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])
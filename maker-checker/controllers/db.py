import boto3
import os

from boto3.resources.base import ServiceResource

def initialize_db() -> ServiceResource:
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_REGION')
    ddb = boto3.resource('dynamodb',
            region_name=aws_region,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
                         )       # Replace with your AWS secret access key
    return ddb
# def initialize_db() -> ServiceResource:
#     ddb = boto3.resource('dynamodb',
#                          endpoint_url='http://db:8000',
#                          region_name='example',                 # Replace with your AWS region
#                          aws_access_key_id='example',           # Replace with your AWS access key ID
#                          aws_secret_access_key='example')       # Replace with your AWS secret access key
#     return ddb
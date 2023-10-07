import boto3
from boto3.resources.base import ServiceResource

def initialize_db() -> ServiceResource:
    ddb = boto3.resource('dynamodb',
                         endpoint_url='http://db:8000',
                         region_name='example',                 # Replace with your AWS region
                         aws_access_key_id='example',           # Replace with your AWS access key ID
                         aws_secret_access_key='example')       # Replace with your AWS secret access key
    return ddb
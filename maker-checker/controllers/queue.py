import boto3
import os

import boto3

def initialize_queue() :
  aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
  aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
  aws_region = os.getenv('AWS_REGION')
  sqs_endpoint_url = os.getenv('SQS_LOCAL_ENDPOINT')
  
  if aws_access_key_id == None:
    sqs = boto3.client('sqs',
                        endpoint_url=sqs_endpoint_url,
                        region_name='eu-central-1',
                        aws_access_key_id='notValidKey',
                        aws_secret_access_key='notValidSecret'
                      )
    return sqs
  
  else:
    sqs = boto3.client('sqs',
                        region_name=aws_region,
                        aws_access_key_id=aws_access_key_id,
                        aws_secret_access_key=aws_secret_access_key
                      )
    return sqs

def test_queue(sqs,queue_url):
  sqs.send_message(
            QueueUrl=queue_url,
            DelaySeconds=10,
            MessageBody=(
                'placeholder'
            )
        )
  return
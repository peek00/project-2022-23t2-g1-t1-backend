import boto3
import botocore.exceptions

def create_approval_request_table():
    ddb = boto3.resource('dynamodb',
                        endpoint_url='http://db:8000',
                        # endpoint_url='http://localhost:8000',
                        region_name='example',                 # Replace with your AWS region
                        aws_access_key_id='example',           # Replace with your AWS access key ID
                        aws_secret_access_key='example')       # Replace with your AWS secret access key
    
    # Define the schema for your table
    try:
        table = ddb.create_table(
            TableName='approval_request',
            AttributeDefinitions=[
                {
                    'AttributeName': 'uid',
                    'AttributeType': 'S'  # String type for uid
                }
            ],
            KeySchema=[
                {
                    'AttributeName': 'uid',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,   # Adjust based on your expected read workload
                'WriteCapacityUnits': 10   # Adjust based on your expected write workload
            }
        )
        
        print('Waiting for table creation...')
        table.wait_until_exists()
        print('Table created successfully.')
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print('Table already exists. Skipping table creation.')
        else:
            raise e

# Call the function to create or skip table creation

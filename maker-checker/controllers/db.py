import time
import boto3
import os

from boto3.resources.base import ServiceResource
import controllers.generate_schema as generate_schema

def initialize_db() -> ServiceResource:

    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_REGION')
    dynamodb_endpoint_url = os.getenv('AWS_DYNAMODB_ENDPOINT')

    # If developing locally
    if aws_access_key_id == None:
        ddb = boto3.resource('dynamodb',
                                endpoint_url="http://db:8000",
                                region_name='example',                 # Replace with your AWS region
                                aws_access_key_id='example',           # Replace with your AWS access key ID
                                aws_secret_access_key='example'
                            ) 
        generate_schema.create_approval_request_table(ddb)
        generate_schema.populate_request_db(ddb)    

        generate_schema.create_request_permission_table(ddb)
        generate_schema.populate_permission_db(ddb)

        generate_schema.create_request_template_table(ddb)
        generate_schema.populate_template_db(ddb)
        
        return ddb
    # Connect to online
    else:
        ddb = boto3.resource('dynamodb',
                region_name=aws_region,
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key=aws_secret_access_key
                            )       # Replace with your AWS secret access key
        return ddb

def create_table_on_first_load(reset) -> bool:
    # aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    # aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    # aws_region = os.getenv('AWS_REGION')
    # dynamodb_endpoint_url = os.getenv('AWS_DYNAMODB_ENDPOINT')

    # # Check whether the table already exists or not (e.g., by table name or some other criteria).
    # # You can use describe_table or list_tables API to check this.
    # # For simplicity, let's assume the table doesn't exist and needs to be created.
    
    # Connect to ddb
    ddb = get_db_connection()
    
    # Get Tables
    tables = ddb.meta.client.list_tables()['TableNames']
    print(tables)
    try:
        if 'approval_request' not in tables:
            print(f"Table approval_request does not exist, creating it.")
            if generate_schema.create_approval_request_table(ddb):
                generate_schema.populate_request_db(ddb)
        
        else:
            if reset:
                print(f"Table approval_request already exists, resetting it.")
                if generate_schema.delete_approval_request_table(ddb):
                    if generate_schema.create_approval_request_table(ddb):
                        generate_schema.populate_request_db(ddb)
                
        if 'request_template' not in ddb.meta.client.list_tables()['TableNames']:
            print(f"Table request_template does not exist, creating it.")
            if generate_schema.create_request_template_table(ddb):
                generate_schema.populate_template_db(ddb)
        
        else:
            if reset:
                print(f"Table request_template already exists, resetting it.")
                if generate_schema.delete_request_template_table(ddb):
                    if generate_schema.create_request_template_table(ddb):
                        generate_schema.populate_template_db(ddb)
        return True
    except Exception as e:
        print(e)
        return False
    

    # if table_does_not_exist:
    #     if aws_access_key_id is None:
    #         ddb = boto3.resource('dynamodb',
    #                             endpoint_url="http://db:8000",
    #                             region_name='example',                 # Replace with your AWS region
    #                             aws_access_key_id='example',           # Replace with your AWS access key ID
    #                             aws_secret_access_key='example'
    #                         )
    #     else:
    #         ddb = boto3.resource('dynamodb',
    #             region_name=aws_region,
    #             aws_access_key_id=aws_access_key_id,
    #             aws_secret_access_key=aws_secret_access_key
    #         )
        
        # generate_schema.create_approval_request_table(ddb)
        # generate_schema.populate_request_db(ddb)

        # generate_schema.create_request_template_table(ddb)
        # generate_schema.populate_template_db(ddb)
    # else:
    #     print("Table already exists, no need to create it.")

def get_db_connection() -> ServiceResource:
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_REGION')
    dynamodb_endpoint_url = os.getenv('AWS_DYNAMODB_ENDPOINT')

    if aws_access_key_id is None:
        ddb = boto3.resource('dynamodb',
                            endpoint_url="http://db:8000",
                            region_name='example',  # Replace with your AWS region
                            aws_access_key_id='example',  # Replace with your AWS access key ID
                            aws_secret_access_key='example'
                        )
    else:
        ddb = boto3.resource('dynamodb',
            region_name=aws_region,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )

    return ddb

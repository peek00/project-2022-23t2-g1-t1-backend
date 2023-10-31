import boto3
import botocore.exceptions
import os


def create_approval_request_table(ddb):
    try:
        partition_key = "company_id"
        sort_key = 'uid'

        table = ddb.create_table(
            TableName='approval_request',
            KeySchema=[
                {
                    'AttributeName': partition_key,
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': sort_key,
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': partition_key,
                    'AttributeType': 'S'  # String type for uid
                },
                {
                    'AttributeName': sort_key,
                    'AttributeType': 'S'  # String type for uid
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,   # Adjust based on your expected read workload
                'WriteCapacityUnits': 10   # Adjust based on your expected write workload
            }
        )
        print('Waiting for table creation...')
        table.wait_until_exists()
    #     print('Table created successfully.')
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print('Table already exists. Skipping table creation.')
        else:
            raise e

def populate_db(ddb):
    table = ddb.Table('approval_request')

    # Insert data
    requests_packet = [
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "cdf7f49f-d5ef-42fd-9fdf-1c27cf61b51e",
            "comments": "No comments",
            "request_type": "Transaction Update",
            "request_title": None,
            "requestor_id": "admin1",
            "approver_id": "admin2",
            "created_at": "2023-10-15T05:16:49.626324",
            "request_details": {
                "increment": "true",
                "amount": "100",
                "account_id": "123"
            },
            "approval_role": "ADMINS",
            "resolution_at": "2023-10-15T05:16:49.631432",
            "request_expiry": "2023-10-20T05:16:49.626338",
            "status": "approved"
        },
        {

            "company_id": "bankofamerciahiremeplease",
            "uid": "cds7f49f-d5ef-42fd-9fdf-1c27cf61b51e",
            "comments": "No comments",
            "request_type": "Transaction Update",
            "request_title": None,
            "requestor_id": "admin2",
            "approver_id": "admin1",
            "created_at": "2023-10-15T05:16:49.626324",
            "request_details": {
                "increment": "true",
                "amount": "100",
                "account_id": "123"
            },
            "approval_role": "ADMINS",
            "resolution_at": "2023-10-15T05:16:49.631432",
            "request_expiry": "2023-10-20T05:16:49.626338",
            "status": "rejected"
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "b47204b2-3940-46d4-bb7d-911a969578a3",
            "comments": None,
            "request_type": "Transaction Update",
            "request_title": None,
            "requestor_id": "admin1",
            "created_at": "2023-10-15T05:16:49.626324",
            "request_details": {
                "increment": "true",
                "amount": "100",
                "account_id": "123"
            },
            "approval_role": "ADMINS",
            "request_expiry": "2023-10-20T05:16:49.626338",
            "status": "pending"
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "b47204b2-3310-46d4-bb7d-911a969578a3",
            "comments": None,
            "request_type": "Transaction Update",
            "request_title": None,
            "requestor_id": "admin1",
            "created_at": "2023-10-15T05:16:49.626324",
            "request_details": {
                "increment": "true",
                "amount": "1000",
                "account_id": "13"
            },
            "approval_role": "ADMINS",
            "request_expiry": "2023-10-20T05:16:49.626338",
            "status": "pending"
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "4b3ba938-a7aa-44f4-b8d4-d83906a3623f",
            "comments": "Request made in error",
            "request_type": "Transaction Update",
            "request_title": None,
            "requestor_id": "admin1",
            "approver_id": "admin1",
            "created_at": "2023-10-15T05:16:49.626324",
            "request_details": {
                "increment": "true",
                "amount": "100",
                "account_id": "123"
            },
            "approval_role": "ADMINS",
            "resolution_at": "2023-10-15T05:16:49.631432",
            "request_expiry": "2023-10-20T05:16:49.626338",
            "status": "withdrawn"
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "unique_id_1",
            "comments": "Additional comments",
            "request_type": "Transaction Update",
            "request_title": "Custom Request Title 1",
            "requestor_id": "admin1",
            "created_at": "2023-10-15T05:16:49.626324",
            "request_details": {
                "increment": "false",  # Change to 'false'
                "amount": "200",       # Change the amount
                "account_id": "456"    # Change the account_id
            },
            "approval_role": "ADMINS",
            "request_expiry": "2023-10-21T05:16:49.626338",   # Change request_expiry
            "status": "pending"  # Change the status
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "unique_id_2",
            "comments": "No comments",
            "request_type": "New Request Type",  # Change request_type
            "request_title": "Custom Request Title 2",
            "requestor_id": "admin2",  # Use admin2 as requestor
            "approver_id": "admin1",  # Use admin1 as approver
            "created_at": "2023-10-15T05:16:49.626324",
            "request_details": {
                "increment": "true",
                "amount": "300",       # Change the amount
                "account_id": "789"    # Change the account_id
            },
            "approval_role": "ADMINS",
            "request_expiry": "2023-10-22T05:16:49.626338",   # Change request_expiry
            "status": "rejected"  # Change the status
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "unique_id_3",
            "comments": "Additional comments",
            "request_type": "New Request Type 2",
            "request_title": "Custom Request Title 3",
            "requestor_id": "admin1",
            "created_at": "2023-10-16T08:30:00.000000",
            "request_details": {
                "increment": "false",
                "amount": "400",
                "account_id": "101"
            },
            "approval_role": "ADMINS",
            "request_expiry": "2023-10-23T08:30:00.000000",
            "status": "pending"
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "unique_id_4",
            "comments": "Additional comments",
            "request_type": "Transaction Update",
            "request_title": "Custom Request Title 4",
            "requestor_id": "admin2",
            "approver_id": "admin1",
            "created_at": "2023-10-16T09:45:00.000000",
            "request_details": {
                "increment": "false",
                "amount": "500",
                "account_id": "202"
            },
            "approval_role": "ADMINS",
            "resolution_at": "2023-10-17T09:45:00.000000",
            "request_expiry": "2023-10-24T09:45:00.000000",
            "status": "rejected"
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "unique_id_5",
            "comments": "No comments",
            "request_type": "Another Request Type",
            "request_title": "Custom Request Title 5",
            "requestor_id": "admin1",
            "approver_id": "admin2",
            "created_at": "2023-10-16T10:00:00.000000",
            "request_details": {
                "increment": "true",
                "amount": "600",
                "account_id": "303"
            },
            "approval_role": "ADMINS",
            "request_expiry": "2023-10-25T10:00:00.000000",
            "status": "approved"
        },
        {
            "company_id": "bankofamerciahiremeplease",
            "uid": "unique_id_6",
            "comments": "Request in progress",
            "request_type": "Transaction Update",
            "request_title": "Custom Request Title 6",
            "requestor_id": "admin1",
            "created_at": "2023-10-16T11:15:00.000000",
            "request_details": {
                "increment": "true",
                "amount": "700",
                "account_id": "404"
            },
            "approval_role": "ADMINS",
            "request_expiry": "2023-10-26T11:15:00.000000",
            "status": "pending"
        },
    ]
    with table.batch_writer() as batch:
        for item in requests_packet:
            batch.put_item(Item=item)

import botocore.exceptions

def create_approval_request_table(ddb):
    try:
        partition_key = "companyid"
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
        print('Waiting for request table creation...')
        table.wait_until_exists()
        return True
    #     print('Table created successfully.')
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print('Table already exists. Skipping table creation.')
        else:
            print(e.response['Error']['Message'])
        raise Exception("Table creation failed.")
        
def create_request_template_table(ddb):
    try:
        partition_key='uid'

        table = ddb.create_table(
            TableName="request_template",
            KeySchema=[
                {
                    'AttributeName': partition_key,
                    'KeyType': 'HASH'  # Partition key
                },
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': partition_key,
                    'AttributeType': 'S'  # String type for uid
                },
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,   # Adjust based on your expected read workload
                'WriteCapacityUnits': 1   # Adjust based on your expected write workload
            }
        )
        print("Waiting for request template table creation...")
        table.wait_until_exists()
        return True
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print('Table already exists. Skipping table creation.')
        else:
            print(e.response['Error']['Message'])
        raise Exception("Table creation failed.")
    

def delete_approval_request_table(ddb):
    try:
        table = ddb.Table('approval_request')
        table.delete()
        print("Waiting for request table deletion...")
        table.wait_until_not_exists()
        return True
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            print('Table does not exist. Skipping table deletion.')
        else:
            print(e.response['Error']['Message'])
        raise Exception("Table deletion failed.")

def delete_request_template_table(ddb):
    try:
        table = ddb.Table('request_template')
        table.delete()
        print("Waiting for request template table deletion...")
        table.wait_until_not_exists()
        return True 
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            print('Table does not exist. Skipping table deletion.')
        else:
            print(e.response['Error']['Message'])
        raise Exception("Table deletion failed.")

def populate_request_db(ddb):
    table = ddb.Table('approval_request')

    try:
        # Insert data
        requests_packet = [
            {
                "uid": "3517402c-a306-4bdb-9da0-b478973fa42c",
                "companyid": "Descenda",
                "comments": "Optional comment for this particular request",
                "request_type": "Points Update",
                "request_title": "Optional title for this particular request",
                "requestor_id": "db0eae93-f3fe-453b-8da9-14767ffc5332",
                "created_at": "2023-11-07T15:12:44.583490",
                "request_details": {
                    "company_id": "Descenda",
                    "change": 100,
                    "user_id": "1602286c-e1eb-4ec6-a0d2-360d8b6e3deb"
                },
                "approval_role": "Owner",
                "request_expiry": "2023-12-12T15:12:44.583502",
                "status": "pending"
            },
            {

                "uid": "cds7f49f-d5ef-42fd-9fdf-1c27cf61b51e",
                "companyid": "Descenda",
                "comments": "No comments",
                "request_type": "Points Update",
                "request_title": None,
                "requestor_id": "db0eae93-f3fe-453b-8da9-14767ffc5332",
                "created_at": "2023-12-07T15:12:44.583490",
                "request_details": {
                    "company_id": "Descenda",
                    "change": 100,
                    "user_id": "2f998bd3-f8b7-4b39-ab3a-16409a3b1936"
                },
                "approval_role": "Owner",
                "request_expiry": "2023-12-12T15:12:44.583502",
                "status": "pending"
            },
            {
                "companyid": "Descenda",
                "uid": "b47204b2-3940-46d4-bb7d-911a969578a3",
                "comments": None,
                "request_type": "Points Update",
                "request_title": None,
                "requestor_id": "admin1",
                "created_at": "2023-10-15T05:16:49.626324",
                "request_details": {
                    "company_id": "Descenda",
                    "change": 100,
                    "user_id": "32d3207d-93d7-4093-8f94-9621499470fc"
                },
                "approval_role": "Owner",
                "request_expiry": "2023-12-12T15:12:44.583502",
                "status": "pending"
            },
            {
                "companyid": "Descenda",
                "uid": "b47204b2-3310-46d4-bb7d-911a969578a3",
                "comments": None,
                "request_type": "Points Update",
                "request_title": None,
                "requestor_id": "admin1",
                "created_at": "2023-10-15T05:16:49.626324",
                "request_details": {
                    "company_id": "Descenda",
                    "change": 1000,
                    "user_id": "3519dbed-f5cf-43d7-8c89-837564694530"
                },
                "approval_role": "Owner",
                "request_expiry": "2023-12-12T15:12:44.583502",
                "status": "pending"
            },
            {
                "companyid": "Descenda",
                "uid": "4b3ba938-a7aa-44f4-b8d4-d83906a3623f",
                "comments": "Request made in error",
                "request_type": "Transaction Update",
                "request_title": None,
                "requestor_id": "admin1",
                "approver_id": "admin1",
                "created_at": "2023-11-12T15:12:44.583502",
                "request_details": {
                    "increment": "true",
                    "amount": "100",
                    "account_id": "123"
                },
                "approval_role": "ADMINS",
                "resolution_at": "2023-10-15T05:16:49.631432",
                "request_expiry": "2023-11-12T15:12:44.583502",
                "status": "withdrawn"
            },
            {
                "companyid": "Descenda",
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
                "request_expiry": "2023-11-12T15:12:44.583502",   # Change request_expiry
                "status": "pending"  # Change the status
            },
            {
                "companyid": "Descenda",
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
                "request_expiry": "2023-11-12T15:12:44.583502",   # Change request_expiry
                "status": "rejected"  # Change the status
            },
            {
                "companyid": "Descenda",
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
                "request_expiry": "2023-11-12T15:12:44.583502",
                "status": "pending"
            },
            {
                "companyid": "Descenda",
                "uid": "unique_id_4",
                "comments": "Additional comments",
                "request_type": "Transaction Update",
                "request_title": "Custom Request Title 4",
                "requestor_id": "admin2",
                "approver_id": "admin1",
                "created_at": "2023-12-16T09:45:00.000000",
                "request_details": {
                    "increment": "false",
                    "amount": "500",
                    "account_id": "202"
                },
                "approval_role": "ADMINS",
                "resolution_at": "2023-10-17T09:45:00.000000",
                "request_expiry": "2023-11-12T15:12:44.583502",
                "status": "rejected"
            },
            {
                "companyid": "Descenda",
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
                "request_expiry": "2023-11-12T15:12:44.583502",
                "status": "approved"
            },
            {
                "companyid": "Descenda",
                "uid": "unique_id_6",
                "comments": "Request in progress",
                "request_type": "Transaction Update",
                "request_title": "Custom Request Title 6",
                "requestor_id": "admin1",
                "created_at": "2023-11-12T15:12:44.583502",
                "request_details": {
                    "increment": "true",
                    "amount": "700",
                    "account_id": "404"
                },
                "approval_role": "ADMINS",
                "request_expiry": "2023-11-12T15:12:44.583502",
                "status": "pending"
            },
        ]
        with table.batch_writer() as batch:
            for item in requests_packet:
                batch.put_item(Item=item)
        return True
    except Exception as e:
        print(e)
        raise Exception("Table population failed.")
    

def populate_template_db(ddb):
    table = ddb.Table('request_template')

    data = [
        {
            "uid": "cdf7f49f",
            "type": "Points Update",
            "details": {
                "change": "int",
                "user_id": "str",
                "company_id": "company"
                },
            "allowed_approvers": [
                "Owner",
            ],
            "allowed_requestors": [
                "Owner",
                "Admin",
                "Engineer"
            ]
        },
        {
            "uid": "dcf5f6zx",
            "type": "Update User Details",
            "details": {
                "firstName": "str",
                "lastName": "str",
                "email": "email",
                "role": "str",
                },
            "allowed_approvers": [
                "Owner",
                "Manager"
            ],
            "allowed_requestors": [
                "Owner",
                "Engineer"
            ]
        },
        {
            "uid": "awfahj6z",
            "type": "Additional Actions",
            "details": {
                "String Input": "str",
                "Integer Input": "int",
                "Float Input": "float",
                "Email": "email",
                "Date": "date",
                },
            "allowed_approvers": [
                "Owner",
                "Manager"
            ],
            "allowed_requestors": [
                "Engineer"
            ]
            
        },
    ]
    try:
        with table.batch_writer() as batch:
            for item in data:
                batch.put_item(Item=item)
        return True
    except Exception as e:
        print(e)
        raise Exception("Table population failed.")
    
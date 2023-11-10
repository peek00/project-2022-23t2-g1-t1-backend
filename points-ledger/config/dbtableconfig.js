const { CreateTableCommand, DeleteTableCommand,ListTablesCommand, BatchWriteItemCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const createDynamoDBClient = require("./dbconfig.js")

class dbtableconfig {
  static instance;
  db;

  constructor() {
    this.db = createDynamoDBClient();
  }

  static getInstance() {
    if (!dbtableconfig.instance) {
      dbtableconfig.instance = new dbtableconfig();
    }
    return dbtableconfig.instance;
  };

  async batchWrite(items) {
    // Divide items array into chunks of 25 items each
    const chunks = [];
    for (let i = 0; i < items.length; i += 25) {
      chunks.push(items.slice(i, i + 25));
    }

    // Process each chunk
    for (const chunk of chunks) {
      const putRequests = chunk.map(item => ({
        PutRequest: {
          Item: marshall(item)
        }
      }));

      const params = {
        RequestItems: {
          "new-points-ledger": putRequests
        }
      };

      let unprocessedItems = null;
      do {
        try {
          const result = await this.db.send(new BatchWriteItemCommand(params));
          // Check if there are unprocessed items
          unprocessedItems = result.UnprocessedItems;
          if (unprocessedItems && unprocessedItems["new-points-ledger"]) {
            // Retry the unprocessed items in the next request
            params.RequestItems = unprocessedItems;
          }
        } catch (error) {
          console.error("Batch write failed:", error);
          throw error;
        }
      } while (unprocessedItems && unprocessedItems["new-points-ledger"]); // Continue until all are processed
    }
  }


  async seedData() {
    const items = [
      // Replace these with your actual data items to seed
      {
        company_id: "apple",
        id: "a73bab06-1baf-4605-a79c-54a43603c0d3",
        user_id: "da7da4ff-f10c-4b89-ab64-ea7263f6b624",
        balance: "5130"
      },
      {
        company_id: "apple",
        id: "6062f766-5313-4521-9c56-954185b85362",
        user_id: "8c874087-9f1a-4c12-a4dc-4a4e53282b8e",
        balance: "9860"
      },
      {
        company_id: "apple",
        id: "0617e6c3-11ee-4429-909b-5d30ac65987e",
        user_id: "8cecd1af-6c38-4186-9fe7-ba1cf15a7379",
        balance: "7977"
      },
      {
        company_id: "pear",
        id: "08f57648-0761-4877-a889-d8842695e1ad",
        user_id: "11082f02-d942-4ede-893c-0f75f36d4388",
        balance: "3468"
      },
      {
        company_id: "pear",
        id: "9f7073b8-c2a6-4aff-9446-f4b629e4085a",
        user_id: "718b5985-6df4-4367-aff0-edc1bd90d66e",
        balance: "6502"
      },
      {
        company_id: "pear",
        id: "69353168-a74a-49a1-964b-7afe981886ce",
        user_id: "7e92ce5f-60d3-4224-b4b2-c9b29e73de16",
        balance: "7075"
      },
      
    ];
  
    const putRequests = items.map(item => ({
      PutRequest: {
        Item: marshall(item)
      }
    }));
  
    const params = {
      RequestItems: {
        "new-points-ledger": putRequests
      }
    };
  
    try {
        console.log(params);
      const result = await this.db.send(new BatchWriteItemCommand(params));
      console.log("Seed data added:", result);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }


  async waitForTableToBecomeActive(tableName) {
    let isTableActive = false;
    let attempts = 0;
    const maxAttempts = 10; // You can change this as needed.
  
    while (!isTableActive && attempts < maxAttempts) {
      const { Table } = await this.db.send(new DescribeTableCommand({ TableName: tableName }));
      isTableActive = Table.TableStatus === 'ACTIVE';
  
      if (!isTableActive) {
        await new Promise(resolve => setTimeout(resolve, 20000)); // Wait for 20 seconds before trying again
        attempts++;
      }
    }
  
    if (isTableActive) {
      console.log(`Table ${tableName} is active.`);
    } else {
      throw new Error(`Table ${tableName} is not active after ${maxAttempts} attempts.`);
    }
  }

  async initialise(tearDown = false) {
    const params = {
      "TableName": "new-points-ledger",
      "KeySchema": [
          {
              "AttributeName": "company_id",
              "KeyType": "HASH"
          },
          {
              "AttributeName": "user_id",
              "KeyType": "RANGE"
          }
      ],
      "BillingMode": "PROVISIONED",
      "AttributeDefinitions": [
          {
              "AttributeName": "company_id",
              "AttributeType": "S"
          },
          {
              "AttributeName": "user_id",
              "AttributeType": "S"
          },
          {
            "AttributeName": "id",
            "AttributeType": "S"
          }
      ],
      "ProvisionedThroughput": {
          "ReadCapacityUnits": 1,
          "WriteCapacityUnits": 1
      },
      "GlobalSecondaryIndexes": [
        // New Global Secondary Index
        {
            "IndexName": "get_all_accounts",
            "KeySchema": [
                {
                    "AttributeName": "user_id",
                    "KeyType": "HASH"
                }
            ],
            "Projection": {
                "ProjectionType": "ALL"
            },
            // ProvisionedThroughput is not required if BillingMode is PAY_PER_REQUEST
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 1,
                "WriteCapacityUnits": 1
            }
        },
        {
          "IndexName": "points_id",
          "KeySchema": [
              {
                  "AttributeName": "company_id",
                  "KeyType": "HASH"
              },
              {
                  "AttributeName": "id",
                  "KeyType": "RANGE"
              }
          ],
          "Projection": {
              "ProjectionType": "ALL"
          },
          "ProvisionedThroughput": {
              "ReadCapacityUnits": 1,
              "WriteCapacityUnits": 1
          }
        },
      ]
    };  

    try {
        const data = await this.db.send(new ListTablesCommand({}));
        console.log(data);
        if (data.TableNames.includes("new-points-ledger")) {
            console.log("Table exists");
            // if (tearDown) {
              // Delete table if it exists
              await this.db.send(new DeleteTableCommand({ TableName: "new-points-ledger" }));
              console.log("Table is deleted");
              await this.db.send(new CreateTableCommand(params));
              console.log("Table is created");
            // }
        } else {
          await this.db.send(new CreateTableCommand(params));
          console.log("Table is created");
        }
    } catch (err) {
      console.log("Error", err);
    }
  };
}

module.exports = dbtableconfig;
const { CreateTableCommand, DeleteTableCommand,ListTablesCommand, BatchWriteItemCommand, DescribeTableCommand,PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const createDynamoDBClient = require("./dbconfig.js")
const fs = require('fs').promises;
const path = require('path');

class dbtableconfig {
  static instance;
  db;
  baseData;
  
  constructor() {
    this.db = createDynamoDBClient();
    this.baseData = [];
  }

  static getInstance() {
    if (!dbtableconfig.instance) {
      dbtableconfig.instance = new dbtableconfig();
    }
    return dbtableconfig.instance;
  };

  async loadBaseData() {
    try {
      const filePath = path.resolve(__dirname, "baseData.json");
      const data = await fs.readFile(filePath, 'utf8');
      this.baseData = JSON.parse(data);
    } catch (error) {
      console.error('Error reading base data from file:', error);
      throw error;
    }
  }

  async batchWrite() {
    // Divide items array into chunks of 25 items each
    console.log("Start writing base data into database");

    const users = this.baseData;
    console.log(users[0]["company_id"]);
    try {
      let count = users.length;
      do {
        let user = users[count - 1];
        try {
          await this.db.send(new PutItemCommand({
            TableName: "new-points-ledger",
            Item: marshall({
              company_id: user["company_id"],
              user_id: user["user_id"],
              id: user["id"],
              balance: user["balance"]  // Assuming 'balance' is a numeric value
            })
          }));
          console.log("PutItem succeeded:", user["user_id"]);
          count--;
        } catch (err) {
          console.error("Unable to add item:", user["user_id"]);
          console.error(err.message);
          await this.delay(1000) // Wait for 1 second
        }
        // for (const user of users) {
        //   console.log(user);
        //   console.log(user["company_id"])
        //   console.log(user["user_id"])
        //   console.log(user["id"])
        //   console.log(user["balance"])
        //   // count--;
        //   try {
        //     await this.db.send(new PutItemCommand({
        //       TableName: "new-points-ledger",
        //       Item: marshall({
        //         company_id: user["company_id"],
        //         user_id: user["user_id"],
        //         id: user["id"],
        //         balance: user["balance"]  // Assuming 'balance' is a numeric value
        //       })
        //     }));
            
        //     console.log("PutItem succeeded:", user["user_id"]);
        //     count--;
        //   } catch (e) {
        //     console.error("Unable to add item:", user["user_id"]);
        //     console.error(e.message);
        //     await this.delay(1000) // Wait for 1 second
        //     // break;
        //   }
      } while (count > 0);
  
      console.log("Initialisation successful, added", users.length, "records");
    } catch (e) {
      console.error("Error occurred while populating points table from JSON file:", e.message);
    }
  
    // const chunks = [];
    // for (let i = 0; i < this.baseData.length; i += 25) {
    //   chunks.push(this.baseData.slice(i, i + 25));
    // }
    // console.log(chunks);
    // Process each chunk
    // for (const chunk of chunks) {
    //   const putRequests = chunk.map(item => ({
    //     PutRequest: {
    //       Item: marshall(item)
    //     }
    //   }));

    //   const params = {
    //     RequestItems: {
    //       "new-points-ledger": putRequests
    //     }
    //   };

    //   let unprocessedItems = null;
    //   do {
    //     try {
    //       const result = await this.db.send(new BatchWriteItemCommand(params));
    //       // Check if there are unprocessed items
    //       unprocessedItems = result.UnprocessedItems;
    //       if (unprocessedItems && unprocessedItems["new-points-ledger"]) {
    //         // Retry the unprocessed items in the next request
    //         params.RequestItems = unprocessedItems;
    //       }
    //     } catch (error) {
    //       console.error("Batch write failed:", error);
    //       throw error;
    //     }
    //   } while (unprocessedItems && unprocessedItems["new-points-ledger"]); // Continue until all are processed
    // }
    // console.log("Batch write completed");
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

  async delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
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
        await this.loadBaseData();
        if (data.TableNames.includes("new-points-ledger")) {
            console.log("Table exists");
            if (tearDown) {
              // Delete table if it exists
              await this.db.send(new DeleteTableCommand({ TableName: "new-points-ledger" }));
              console.log("Table is deleted");
              await this.delay(5000);
              await this.db.send(new CreateTableCommand(params));
              console.log("Table is created");
              await this.delay(5000);
              this.batchWrite();
            }
        } else {
          await this.db.send(new CreateTableCommand(params));
          console.log("Table is created");
          await this.delay(5000);
          await this.batchWrite();
        }
    } catch (err) {
      console.log("Error", err);
    }
  };
}

module.exports = dbtableconfig;
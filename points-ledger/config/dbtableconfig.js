// import { createDynamoDBClient } from "./db.js";
// import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
// import { CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
const { CreateTableCommand, DeleteTableCommand,ListTablesCommand } = require("@aws-sdk/client-dynamodb");
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

  async initialise(tearDown = false) {
    const params = {
        "TableName": "points_ledger",
        "KeySchema": [
          {
            "AttributeName": "id",
            "KeyType": "HASH"
          }
        ],
        "BillingMode": "PROVISIONED",
        "AttributeDefinitions": [
          {
            "AttributeName": "id",
            "AttributeType": "S"
          },
          {
            "AttributeName": "user_id",
            "AttributeType": "S"
          }
        ],
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 1,
          "WriteCapacityUnits": 1
        },
        "GlobalSecondaryIndexes": [
          {
            "IndexName": "user_id",
            "KeySchema": [
              {
                "AttributeName": "user_id",
                "KeyType": "HASH"
              }
            ],
            "Projection": {
              "ProjectionType": "ALL"
            },
            "ProvisionedThroughput": {
              "ReadCapacityUnits": 1,
              "WriteCapacityUnits": 1
            }
          }
        ]
      };

    try {
        const data = await this.db.send(new ListTablesCommand({}));
        if (data.TableNames.includes("points_ledger")) {
            if (tearDown) {
              // Delete table if it exists
              await this.db.send(new DeleteTableCommand({ TableName: "points_ledger" }));
              console.log("Table is deleted");
              await this.db.send(new CreateTableCommand(params));
              console.log("Table is created");
            }
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
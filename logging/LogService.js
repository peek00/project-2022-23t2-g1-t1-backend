import { createDynamoDBClient } from "./db.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { CreateTableCommand, DeleteTableCommand, ScanCommand, QueryCommand, PutItemCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from "uuid";
export class LogService {
  static instance;
  db;

  constructor() {
    this.db = createDynamoDBClient();
  }

  static getInstance() {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  };

  async initialise(tearDown = false) {
    const params = {
      TableName: "logs",
      KeySchema: [
        { AttributeName: "logGroup", KeyType: "HASH" }, // Partition key
        { AttributeName: "id", KeyType: "RANGE" }, // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: "logGroup", AttributeType: "S" },
        { AttributeName: "id", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      GlobalSecondaryIndex: [
        {
          IndexName: "userId",
          KeySchema: [
            { AttributeName: "userId", KeyType:"HASH"}
          ],
          Projection: {
            ProjectionType: "ALL"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
      TimeToLiveSpecification: {
        AttributeName: "ttl",
        Enabled: "TRUE",
      },
    };

    try {
      const data = await this.db.send(new ListTablesCommand({}));
      if (data.TableNames.includes("logs")) {
        if (tearDown) {
          // Delete table if it exists
          await this.db.send(new DeleteTableCommand({ TableName: "logs" }));
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

  async queryLog(queryParams) {
    try {
      let response = {
        data: [],
        nextPageKey: null,
      }
      // let ExclusiveStartKey = queryParams.ExclusiveStartKey || null;
      const params = {
        TableName: "logs",
        ...queryParams
      };
      const data = await this.db.send(new QueryCommand(params));
      if (data.LastEvaluatedKey) {
        response.nextPageKey = unmarshall(data.LastEvaluatedKey).id;
      }
      
      if (data.Items.length === 0) {
        return response
      }
      console.log("Total Number of Logs Retrieved: ", data.Items.length);
      response.data = data.Items.map((item) => unmarshall(item));
      console.log(response);
      return response;
    } catch (err) {
      console.log("Error", err);
    }
  };

  formatQueryParams(options){
    const { logGroup, startTime, endTime, limit, offsetId, order, userId } = options;
    let queryParams = {};
    let FilterExpressionLs = [];
    let timeAdded = false;

    if (logGroup) {
      queryParams.KeyConditionExpression = "logGroup = :logGroup";
      queryParams.ExpressionAttributeValues = marshall({ ":logGroup": logGroup });
    } else {
      throw new Error("logGroup is required");
    }
    
    if (startTime && !endTime) {
      FilterExpressionLs.push("#timestamp >= :start");
      queryParams.ExpressionAttributeValues[":start"] = marshall(startTime);
      timeAdded = true;
    } else if (!startTime && endTime) {
      FilterExpressionLs.push("#timestamp <= :end");
      queryParams.ExpressionAttributeValues[":end"] = marshall(endTime);
      timeAdded = true;
    } else if (startTime && endTime) {
      FilterExpressionLs.push("#timestamp BETWEEN :start AND :end");
      queryParams.ExpressionAttributeValues[":start"] = marshall(startTime);
      queryParams.ExpressionAttributeValues[":end"] = marshall(endTime);
      timeAdded = true;
    };

    if (timeAdded) {
      queryParams.ExpressionAttributeNames = { "#timestamp": "timestamp" };
    }

    if (Number(limit)!==20) {
      queryParams.Limit = Number(limit);
    }

    if (offsetId) {
      queryParams.ExclusiveStartKey = marshall({ 
        logGroup: logGroup,
        id: offsetId 
      });
    }

    if (order === "ASC") {
      queryParams.ScanIndexForward = true;
    } else if (order === "DESC") {
      queryParams.ScanIndexForward = false;
    } else {
      throw new Error("Invalid order");
    }

    if (userId) {
      queryParams.IndexName = "userId";
      FilterExpressionLs.push("userId = :userId");
      queryParams.ExpressionAttributeValues = marshall({ ":userId": userId });
    }

    if (FilterExpressionLs.length > 0) {
      queryParams.FilterExpression = FilterExpressionLs.join(" AND ");
    }

    console.log(queryParams)
    return queryParams;
  }

  async getLogs(options) {
    const queryParams = this.formatQueryParams(options);
    const params = {
      TableName: "logs",
      ...queryParams,
    };
    console.log(params)
    return this.queryLog(params);
  }
  // Upload with TTL index in days
  async uploadLogs(retentionPolicy, logGroup, data) {
    const params = {
      TableName: "logs",
      Item: marshall({
        logGroup,
        id: uuid(),
        ttl: (Date.now() + Number(retentionPolicy) * 24 * 60 * 60 * 1000),
        // ttl: (Date.now() + Number(retentionPolicy) * 60 * 1000), // 1 minute
        ...data,
      }),
    };
    console.log("Uploading Logs with params: ", params);
    return await this.db.send(new PutItemCommand(params));
  }

}

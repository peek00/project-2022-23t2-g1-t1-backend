import { createDynamoDBClient } from "./db.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { CreateTableCommand, DeleteTableCommand, ScanCommand, PutItemCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";

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
        { AttributeName: "timestamp", KeyType: "RANGE" }, // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: "logGroup", AttributeType: "S" },
        { AttributeName: "timestamp", AttributeType: "S" },
        { AttributeName: "ttl", AttributeType: "N" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
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
      const data = await this.db.send(new ScanCommand(queryParams));
      console.log("Scan successful.");
      console.log(data);
      console.log("Success", data.Items);
      if (data.Items === undefined) {
        return [];
      }
      return data.Items.map((item) => unmarshall(item));
    } catch (err) {
      console.log("Error", err);
    }
  };

  formatQueryParams(options){
    const { logGroup, timeStamp, timeStampRange } = options;
    let queryParams = {};
    let FilterExpressionLs = [];
    let ExpressionAttributeValuesLs = {};

    if (logGroup) {
      queryParams.logGroup = logGroup;
      FilterExpressionLs.push("logGroup = :logGroup");
      ExpressionAttributeValuesLs[":logGroup"] = logGroup;
    }
    
    if (timeStamp) {
      FilterExpressionLs.push("timestamp = :timestamp");
      ExpressionAttributeValuesLs[":timestamp"] = timeStamp;
    } else if (timeStampRange) {
      FilterExpressionLs.push("timestamp BETWEEN :start AND :end");
      ExpressionAttributeValuesLs[":start"] = timeStampRange.start;
      ExpressionAttributeValuesLs[":end"] = timeStampRange.end;
    };
    console.log(FilterExpressionLs);
    if (FilterExpressionLs.length > 0) {
      queryParams.FilterExpression = FilterExpressionLs.join(" AND ");
      queryParams.ExpressionAttributeValues = ExpressionAttributeValuesLs;
    }
    return queryParams;
  }

  async getLogs(options) {
    const queryParams = this.formatQueryParams(options);
    const params = {
      TableName: "logs",
      ...queryParams,
    };
    console.log(params);
    return this.queryLog(params);
  }
  // Upload with TTL index in days
  async uploadLogs(retentionPolicy, logGroup, data) {
    const params = {
      TableName: "logs",
      Item: marshall({
        logGroup,
        timestamp: Date.now(),
        // ttl: (Date.now() + Number(retentionPolicy) * 24 * 60 * 60 * 1000).toString(),
        // ttl: (Date.now() + Number(retentionPolicy) * 60 * 1000), // 1 minute
        ...data,
      }),
      ttl: Math.floor(Date.now() / 1000) + Number(retentionPolicy) * 60, // 1 minute
    };
    console.log(params);
    return await this.db.send(new PutItemCommand(params));
  }
}

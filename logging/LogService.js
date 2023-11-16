import { createDynamoDBClient } from "./db.js";
import { createCacheClient } from "./cache.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { CreateTableCommand, DeleteTableCommand, ScanCommand, QueryCommand, PutItemCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from "uuid";
export class LogService {
  static instance;
  db;
  cache;

  constructor() {
    this.db = createDynamoDBClient();
    this.cache = createCacheClient();
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
        { AttributeName: "userId", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: "UserId-Index",
          KeySchema: [
            { AttributeName: "userId", KeyType:"HASH"}
          ],
          Projection: {
            ProjectionType: "ALL"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          }
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
          //console.log("Table is deleted");
          await this.db.send(new CreateTableCommand(params));
          //console.log("Table is created");
        }
      } else {
        await this.db.send(new CreateTableCommand(params));
        //console.log("Table is created");
      }
      await this.cache.flushAllMatchingLogPattern();
    } catch (err) {
      //console.log("Error", err);
    }
  };

  async queryLog(queryParams) {
    try {
      let records = [];
      let nextPageKey = null;
      const params = {
        TableName: "logs",
        ...queryParams
      };
      const data = await this.db.send(new QueryCommand(params));
      if (data.LastEvaluatedKey) {
        nextPageKey = unmarshall(data.LastEvaluatedKey).id;
      }
      
      if (data.Items && data.Items.length > 0) {
        //console.log("Total Number of Logs Retrieved: ", data.Items.length);
        records = data.Items.map((item) => unmarshall(item))
      }
      return {
        data: records,
        nextPageKey: nextPageKey,
      };
    } catch (err) {
      //console.log("Error", err);
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
      queryParams.IndexName = "UserId-Index";
      queryParams.KeyConditionExpression = "userId = :userId";
      queryParams.ExpressionAttributeValues = marshall({ ":userId": userId });
    }

    if (FilterExpressionLs.length > 0) {
      queryParams.FilterExpression = FilterExpressionLs.join(" AND ");
    }

    //console.log(queryParams)
    return queryParams;
  }

  async getLogs(options) {
    const queryParams = this.formatQueryParams(options);
    const params = {
      TableName: "logs",
      ...queryParams,
    };
    //console.log(params)
    const cachedLogs = await this.cache.get(this.getCacheKey(params));
    if (cachedLogs) {
      //console.log('cache hit')
      return JSON.parse(cachedLogs);
    } else {
      //console.log('cache miss')
      const logResponse = await this.queryLog(params);
      // If logResponse is not empty, write to cache
      if (logResponse.data && logResponse.data.length > 0) {
        this.cache.write(this.getCacheKey(params), JSON.stringify(logResponse), 60 * 60 * 1000); // 1 hour
      }
      return logResponse;
    }
  }

  getCacheKey(params) {
    // Escape special characters
    const parsed = `logs-${JSON.stringify(params)}`;
    const key = parsed.replace(/[^a-zA-Z0-9]/g, "");
    return key;
  }

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
    try {
      const logGroups = await this.getLogGroups();
      if (!logGroups.includes(logGroup)) {
        //console.log("Adding new log group to cache");
        logGroups.push(logGroup);
        this.cache.write("logGroups", JSON.stringify(logGroups), -1); 
      } 
      return await this.db.send(new PutItemCommand(params));
    } catch (error) {
      console.error(error.message);
    }
  }

  async getLogGroups() {
    const params = {
      TableName: "logs",
      ProjectionExpression: "logGroup",
      ScanIndexForward: false
    };
    try {
      // Get all log groups from cache
      const cachedLogGroups = await this.cache.get("logGroups");
      if (cachedLogGroups) {
        //console.log('cache hit')
        return JSON.parse(cachedLogGroups);
      } else {
        //console.log('cache miss')
        const logGroups = await this.scanLogGroups(params);
        // If logGroups is not empty, write to cache
        if (logGroups && logGroups.length > 0) {
          this.cache.write("logGroups", JSON.stringify(logGroups), -1);
        }
        return logGroups;
      }
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async scanLogGroups(params) {
    const data = await this.db.send(new ScanCommand(params));
    if (data.Count === 0) {
      throw new Error("No log groups found");
    }
    let output = new Set()
    data.Items.forEach((item) => {
      output.add(unmarshall(item).logGroup);
    });
    return Array.from(output);
  }
}

import { DynamoDBClient, CreateTableCommand, DeleteTableCommand, ScanCommand, ListTablesCommand, Condition } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import IDatabaseProvider from "./DatabaseProviderInterface";
import { config } from "../../config/config";
const { AWSConfig } = config;

export class DynamoDB implements IDatabaseProvider {
  private static instance: DynamoDB;
  private client: DynamoDBClient;
  private db: DynamoDBDocumentClient;

  private constructor() {
    this.client = this.createDynamoDbClient();
    this.db = this.createDynamoDbDocumentClient();
  }

  private createDynamoDbClient(): DynamoDBClient {
    return new DynamoDBClient({
      region: AWSConfig.region,
      endpoint: AWSConfig.dynamoDBEndpoint,
      credentials: {
        accessKeyId: AWSConfig.accessKeyId,
        secretAccessKey: AWSConfig.secretAccessKey,
      },
    });
  }

  private createDynamoDbDocumentClient(): DynamoDBDocumentClient {
    return DynamoDBDocumentClient.from(this.createDynamoDbClient());
  }

  public static getInstance(): DynamoDB {
    if (!DynamoDB.instance) {
      DynamoDB.instance = new DynamoDB();
    }
    return DynamoDB.instance;
  }

  public async listTables(): Promise<any> {
    try {
      const existingTables = await this.client.send(new ListTablesCommand({}));
      return existingTables;
    } catch (error) {
      console.log(error);
      throw new Error(`Error listing tables`);
    }
  }

  public async createTable(tableName:string, config: any): Promise<any> {
    // create Table if not exists
    try {
      console.log(`creating table ${tableName}`);
      const existingTables = await this.listTables();
      const tableNames = existingTables.TableNames;
      if (tableNames && tableNames.indexOf(tableName) !== -1) {
        return;
      }
      // Assert that config has the required properties
      if (!config.KeySchema || !config.AttributeDefinitions) {
        throw new Error(`Invalid config for table ${tableName}`);
      }
      await this.client.send(new CreateTableCommand({
        TableName: tableName,
        KeySchema: config.KeySchema,
        AttributeDefinitions: config.AttributeDefinitions,
        ProvisionedThroughput: config.ProvisionedThroughput || {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      }));
    } catch (error) {
      console.log(error);
      throw new Error(`Error creating table: ${tableName}`);
    }

  }

  public async deleteTable(tableName: string): Promise<any> {
    try {
      const existingTables = await this.client.send(new ListTablesCommand({}));
      const tableNames = existingTables.TableNames;
      if (tableNames && tableNames.indexOf(tableName) !== -1) {
        await this.client.send(new DeleteTableCommand({
          TableName: tableName,
        }));
      }
    } catch (error) {
      throw new Error(`Error deleting table: ${tableName}`);
    }
  }

  public async add(tableName:string, data: any): Promise<any> {
    try {
      const response = await this.db.send(new PutCommand({
        TableName: tableName,
        Item: {
          ...data,
        },
      }));
      return response;
    } catch (error) {
      console.log(error)
      throw new Error(`Error adding item ${data} to table: ${tableName}`);
    }
  }

  public async updateBy(tableName:string, details: any): Promise<any> {
    const {Key, UpdateExpression, ExpressionAttributeValues, ExpressionAttributeNames} = details;
    if (Key === undefined || UpdateExpression === undefined || ExpressionAttributeValues === undefined || ExpressionAttributeNames === undefined) {
      throw new Error("Invalid update details");
    }
    try {
      const response = await this.db.send(new UpdateCommand({
        TableName: tableName,
        Key,
        ExpressionAttributeNames,
        UpdateExpression,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }));
      return response;
    } catch (error) {
      console.log(error)
      throw new Error(`Error update item ${Key} to table: ${tableName}`);
    }
  }

  public async deleteBy(tableName:string, details:any): Promise<any> {
    const {Key} = details;
    if (Key === undefined) {
      throw new Error("Invalid delete details");
    }
    try {
      const response = await this.db.send(new DeleteCommand({
        TableName: tableName,
        Key,
      }));
      return response;
    } catch (error) {
      throw new Error(`Error deleting item ${Key} to table: ${tableName}`);
    }
  }

  public async findAll(tableName:string, filter: Record<string, Condition>): Promise<any> {
    try {
      const response = await this.db.send(new ScanCommand({
        TableName: tableName,
        // FilterExpression: filter ? Object.keys(filter).map((key) => `${key} = :${key}`).join(" AND ") : undefined,
      }));
      // Convert response to json
      console.log(response)
      // return response;
      if (response.Items === undefined || response.Items.length == 0) return [];
      console.log(response.Items)
      const formatted = response.Items.map((item) => {
        return unmarshall(item);
      });
      console.log("Formatted",formatted)
      return formatted;
    } catch (error){
      console.log(error)
      throw new Error(`Error finding item ${filter} to table: ${tableName}`);
    }
  }

  public async findBy(tableName:string, filter: any): Promise<any> {
    const response = await this.client.send(new ScanCommand(filter));
    return response;
  }
}
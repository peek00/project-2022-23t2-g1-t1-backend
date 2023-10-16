import { ScanCommandInput } from "@aws-sdk/client-dynamodb";
import IDatabaseProvider from "../../modules/DatabaseProvider/DatabaseProviderInterface";
import { DynamoDB } from "../../modules/DatabaseProvider/DynamoDB";

export class PolicyService {
  private static instance: PolicyService;
  private db: IDatabaseProvider;
  private tableName: string = "policy";

  private constructor() {
    this.db = DynamoDB.getInstance();
  }

  public static getInstance(): PolicyService {
    if (!PolicyService.instance) {
      PolicyService.instance = new PolicyService();
    }
    return PolicyService.instance;
  }

  public static async initialize(): Promise<void> {
    const policyService = PolicyService.getInstance();
    // Check if table exists
    const tables = await policyService.db.listTables();
    console.log(tables);
    if (tables.TableNames.includes(policyService.tableName)) {
      await policyService.createTable();
    } 
    // Check if there are any policies in the table
    const policies = await policyService.findAll();
    if (policies.Count === 0) {
      const defaultPolicy = {
        path: "/",
        GET: ["admin", "user", "superadmin"],
        POST: ["admin"],
        PUT: ["admin"],
        DELETE: ["admin"],
      };
      await policyService.add(defaultPolicy);
    }
  }

  public static async tearDown(): Promise<void> {
    const policyService = PolicyService.getInstance();
    // Check if table exists
    const tables = await policyService.db.listTables();
    if (tables.TableNames.includes(policyService.tableName)) {
      await policyService.deleteTable();
    }
  }

  private async createTable(restart:boolean = true): Promise<any> {
    console.log("createTable");
    if (restart) {
      await PolicyService.tearDown();
    }
    await this.db.createTable(this.tableName, {
      KeySchema: [
        {
          AttributeName: "path",
          KeyType: "HASH",
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: "path",
          AttributeType: "S",
        }
      ],
    });
  }

  private async deleteTable(): Promise<any> {
    await this.db.deleteTable(this.tableName);
  }

  public async add(policy: any): Promise<any> {
    return await this.db.add(this.tableName, policy);
  }

  public async update(policy: any): Promise<any> {
    return await this.db.update(this.tableName, policy.id, policy);
  }

  public async deleteById(id: string): Promise<any> {
    return await this.db.delete(this.tableName, id);
  }

  public async findOne(id: string): Promise<any> {
    return await this.db.findOne(this.tableName, id);
  }

  public async findAll(): Promise<any> {
    console.log("findAll");
    const params: ScanCommandInput = {
      TableName: this.tableName,
    };
    return await this.db.findAll(this.tableName, params);
  }

  public async findBy(filter: any): Promise<any> {
    return await this.db.findBy(this.tableName, filter);
  }
}

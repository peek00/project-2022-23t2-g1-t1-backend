import { ScanCommandInput } from "@aws-sdk/client-dynamodb";
import IDatabaseProvider from "../../modules/DatabaseProvider/DatabaseProviderInterface";
import { DynamoDB } from "../../modules/DatabaseProvider/DynamoDB";
import ICacheProvider from "../../modules/CacheProvider/CacherProviderInterface";
import { Redis } from "../../modules/CacheProvider/Redis";

export class PolicyService {
  private static instance: PolicyService;
  private db: IDatabaseProvider;
  private cacheProvider: ICacheProvider
  private tableName: string = "policy";

  private constructor() {
    this.db = DynamoDB.getInstance();
    this.cacheProvider = Redis.getInstance();
  }

  public static getInstance(): PolicyService {
    if (!PolicyService.instance) {
      PolicyService.instance = new PolicyService();
    }
    return PolicyService.instance;
  }

  public static async initialize(restart:boolean = true): Promise<void> {
    const policyService = PolicyService.getInstance();
    if (restart) {
      await PolicyService.tearDown();
    }
    // Check if table exists
    const tables = await policyService.db.listTables();
    console.log(tables);
    if (!tables.TableNames.includes(policyService.tableName)) {
      await policyService.createTable();
    } 
    // Check if there are any policies in the table
    const policies = await policyService.findAll();
    console.log(policies)
    if (policies === undefined || policies.length === 0) {
      const defaultPolicy = {
        path: "*",
        GET: ["superadmin", "admin"],
        POST: ["superadmin", "admin"],
        PUT: ["superadmin", "admin"],
        DELETE: ["superadmin", "admin"],
      };
      await policyService.add(defaultPolicy);
      // Add auth route policy
      const authPolicy = {
        path: "/auth",
        GET: [],
        POST: [],
        PUT: [],
        DELETE: [],
      };
      await policyService.add(authPolicy);
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

  private async createTable(): Promise<any> {
    console.log("createTable");
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

  public async getAllPolicies(): Promise<any> {
    // Check cache
    const cachedPolicies = await this.cacheProvider.get("policies");
    if (cachedPolicies) {
      return JSON.parse(cachedPolicies);
    } else {
      const policies = await this.findAll();
      console.log(policies);
      await this.cacheProvider.write("policies", JSON.stringify(policies), -1); 
      return policies;
    }
  }

  public async getPolicy(path: string, method: string): Promise<String[]> {
    const policies = await this.getAllPolicies();
    // const pathMap =  policies.find((policy: any) => policy.path === path) || policies.find((policy: any) => policy.path === "*"); //Default return default pathMap
    // return pathMap[method];
    // Try to find exact match, if not, fall back to parents, if not, fall back to *
    const exactMatch = policies.find((policy: any) => policy.path === path);
    if (exactMatch) {
      return exactMatch[method];
    }
    const parentMatch = policies.find((policy: any) => path.startsWith(policy.path));
    if (parentMatch) {
      return parentMatch[method];
    }
    const defaultMatch = policies.find((policy: any) => policy.path === "*");
    return defaultMatch[method];
  }
}

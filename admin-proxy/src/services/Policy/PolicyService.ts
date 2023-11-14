import IDatabaseProvider from "../../modules/DatabaseProvider/DatabaseProviderInterface";
import { DynamoDB } from "../../modules/DatabaseProvider/DynamoDB";
import ICacheProvider from "../../modules/CacheProvider/CacherProviderInterface";
import { Redis } from "../../modules/CacheProvider/Redis";
import {initialPolicy} from "../../config/initialPolicy";

interface Policy {
  endpoint: string;
  GET: string[];
  POST: string[];
  PUT: string[];
  DELETE: string[];
}

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

  public static async initialize(restart:boolean = false): Promise<void> {
    const policyService = PolicyService.getInstance();
    if (restart) {
      await PolicyService.tearDown();
    }

    // Check if table exists
    const tables = await policyService.db.listTables();
    if (process.env.NODE_ENV !== 'production') //console.log(tables);
    if (tables===undefined || !tables.TableNames.includes(policyService.tableName)) {
      await policyService.createTable();
    } 
    // Check if there are any policies in the table
    const policies = await policyService.findAll();
    if (process.env.NODE_ENV !== 'production') //console.log(policies)
    if (policies === undefined || policies.length === 0) {
      await Promise.all(initialPolicy.map(async (policy: Policy) => {
        await policyService.add(policy);
      }));
    }
  }

  public static async tearDown(): Promise<void> {
    const policyService = PolicyService.getInstance();
    // Check if table exists
    const tables = await policyService.db.listTables();
    if (process.env.NODE_ENV !== 'production') //console.log(tables);
    if (tables && tables.TableNames.includes(policyService.tableName)) {
      await policyService.deleteTable();
    }
  }

  private async createTable(): Promise<any> {
    if (process.env.NODE_ENV !== 'production') //console.log("createTable");
    await this.db.createTable(this.tableName, {
      KeySchema: [
        {
          AttributeName: "endpoint",
          KeyType: "HASH",
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: "endpoint",
          AttributeType: "S",
        }
      ],
    });
  }

  private async deleteTable(): Promise<any> {
    await this.db.deleteTable(this.tableName);
  }

  public async add(policy: Policy): Promise<any> {
    if (process.env.NODE_ENV !== 'production') //console.log("policyService", policy, this.tableName);
    // Drop cache for policy
    await this.cacheProvider.remove("policies");
    return await this.db.add(this.tableName, policy);
  }

  public async update(policy: Partial<Policy>): Promise<any> {
    // Generate expression statement
    let UpdateExpressionArr:string[] = [];
    let ExpressionAttributeValues:any = {};
    let ExpressionAttributeNames:any = {};
    if (policy.GET) {
      ExpressionAttributeValues[":GET"] = policy.GET;
      UpdateExpressionArr.push("#GET = :GET");
      ExpressionAttributeNames["#GET"] = "GET";
    }
    if (policy.POST) {
      ExpressionAttributeValues[":POST"] = policy.POST;
      UpdateExpressionArr.push("#POST = :POST");
      ExpressionAttributeNames["#POST"] = "POST";
    }
    if (policy.PUT) {
      ExpressionAttributeValues[":PUT"] = policy.PUT;
      UpdateExpressionArr.push("#PUT = :PUT");
      ExpressionAttributeNames["#PUT"] = "PUT";
    }
    if (policy.DELETE) {
      ExpressionAttributeValues[":DELETE"] = policy.DELETE;
      UpdateExpressionArr.push("#DELETE = :DELETE");
      ExpressionAttributeNames["#DELETE"] = "DELETE";
    }

    if (UpdateExpressionArr.length === 0) {
      throw new Error("Nothing to update");
    }

    const details = {
      Key: {
        endpoint: policy.endpoint,
      },
      ExpressionAttributeNames,
      UpdateExpression: `SET ${UpdateExpressionArr.join(", ")}`,
      ExpressionAttributeValues,
    }
    if (process.env.NODE_ENV !== 'production') //console.log(details)
    // Drop cache for policy
    await this.cacheProvider.remove("policies");
    await this.cacheProvider.flushAllMatchingPattern(`policy*`);
    return await this.db.updateBy(this.tableName, details);
  }

  public async delete(policy: Partial<Policy>): Promise<any> {
    const details = {
      Key: {
        endpoint: policy.endpoint,
      },
    }
    // Drop cache for policy
    await this.cacheProvider.remove("policies");
    await this.cacheProvider.flushAllMatchingPattern(`policy*`);
    return await this.db.deleteBy(this.tableName, details);
  }

  public async findAll(): Promise<any> {
    if (process.env.NODE_ENV !== 'production') //console.log("findAll");
    const params = {};
    return await this.db.findAll(this.tableName, params);
  }

  public async getAllPolicies(): Promise<any> {
    // Check cache
    const cachedPolicies = await this.cacheProvider.get("policies");
    if (cachedPolicies) {
      return JSON.parse(cachedPolicies);
    } else {
      const policies = await this.findAll();
      if (process.env.NODE_ENV !== 'production') //console.log(policies);
      await this.cacheProvider.write("policies", JSON.stringify(policies), -1); 
      return policies;
    }
  }

  public async getPolicy(endpoint: string, method: string): Promise<string[]> {
    const policies = await this.getAllPolicies();
    const exactMatch = policies.find((policy: any) => policy.endpoint === endpoint);
    if (exactMatch && exactMatch[method]) {
      return exactMatch[method];
    }
    const parentMatch = policies.find((policy: any) => endpoint.startsWith(policy.endpoint));
    if (parentMatch && parentMatch[method]) {
      return parentMatch[method];
    }
    const defaultMatch = policies.find((policy: any) => policy.endpoint === "*");
    return defaultMatch[method];
  }

  public async mapRoleActions(role: string[], pageLs: string[]): Promise<any> {
    const cachedPolicies = await this.cacheProvider.get(this.getCacheKey(role, pageLs));
    if (cachedPolicies) {
      return JSON.parse(cachedPolicies);
    } else {
      let pageMap:{[key:string]: any} = {};
      try {
        await Promise.all(pageLs.map(async ms => {
          const api_endpoint =  ms.includes('policy') ? ms : `/api/${ms}`;
          let permissions:{[key:string]:boolean} = {
            GET: false,
            POST: false,
            PUT: false,
            DELETE: false,
          }
          const methods = Object.keys(permissions);
          await Promise.all(methods.map(async (method: string) => {
            // Retrieve the policy for the endpoint
            const endpointPolicy = await this.getPolicy(api_endpoint, method);
            // if (process.env.NODE_ENV !== 'production') //console.log(endpointPolicy);
            // compare userRole and endpointPolicy
            // if (process.env.NODE_ENV !== 'production') //console.log(`[${method}]${api_endpoint} | endpointPolicy: ${endpointPolicy} | role: ${role}`)
            // Make sure that at least one role is included in the endpoint policy
            if (endpointPolicy.length ===0 || endpointPolicy.some((policyRole: string) => role.includes(policyRole))) {
              // if (process.env.NODE_ENV !== 'production') //console.log('true')
              permissions[method] = true;
            } else {
              // if (process.env.NODE_ENV !== 'production') //console.log('false')
              permissions[method] = false;
            }
          }));
          pageMap[ms] = permissions;
        }));
        await this.cacheProvider.write(this.getCacheKey(role, pageLs), JSON.stringify(pageMap), -1); 
      } catch (error) {
        console.error(error);
      } finally {
        return pageMap;
      }
    }
  }

  public getCacheKey(role:string[], pageLs:string[]):string {
    return `policy${role.join('')}${pageLs.join('')}`.replace(/\s/g, '');  
  }

}

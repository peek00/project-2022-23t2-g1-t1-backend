import { PolicyService } from "../Policy/PolicyService";
import policyService from "../Policy";

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type Policy = {
  [key in HttpMethod]: string[];
}

export class AuthorisationService {
  private static instance: AuthorisationService;
  private policyService: PolicyService;

  private constructor() {
    this.policyService = policyService;
  }

  public static getInstance(): AuthorisationService {
    if (!AuthorisationService.instance) {
      AuthorisationService.instance = new AuthorisationService();
    }
    return AuthorisationService.instance;
  }

  public async authorize(userRoles: string[], httpMethod:HttpMethod, proxy: string) {
    console.log("proxyPath",proxy)
    console.log("httpMethod",httpMethod)
    console.log("userRoles", userRoles)
    // If user has 'superadmin' role, allow access to all resources
    if (userRoles.includes('superadmin') || userRoles.includes('admin')) {
      return;
    }
    // const policy = await this.getPolicy(proxy);
    const policy = {
      GET: ['admin', 'user','superadmin'],
      POST: ['admin'],
      PATCH: ['admin'],
      DELETE: ['admin'],
    }
    // check if user has access to proxy
    this.checkPolicy(userRoles, httpMethod, policy);
  }

  private async getPolicy(proxy: string) {
    // get policy for proxy
    const policy = await this.policyService.findBy({ proxy });
    if (!policy) {
      throw new Error("Policy not found");
    }
    return policy;
  }

  private checkPolicy(userRoles: string[], httpMethod:HttpMethod, policy: Policy) {
    // check if user has access to proxy
    const accessRole = policy[httpMethod];
    if (!accessRole) {
      throw new Error("Not authorized");
    }
    // check if user has access to resource
    if (!userRoles.some((role) => accessRole.includes(role))) {
      throw new Error("Not authorized");
    }
  }
}

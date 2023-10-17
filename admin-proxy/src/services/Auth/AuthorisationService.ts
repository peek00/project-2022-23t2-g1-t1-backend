import { PolicyService } from "../Policy/PolicyService";
import policyService from "../Policy";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

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
    // check if user has access to proxy
    const accessRole = await this.policyService.getPolicy(proxy, httpMethod);
    console.log("accessRole",accessRole)
    console.log("accessRole",accessRole.length)
    if (accessRole.length === 0) return; // Allow all to access
    if (!accessRole) {
      throw new Error("No Policy Exist");
    }
    // check if user has access to resource
    if (!userRoles.some((role) => accessRole.includes(role))) {
      throw new Error("Not authorized");
    }
  }
}

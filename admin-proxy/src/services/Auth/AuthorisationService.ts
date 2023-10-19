import { PolicyService } from "../Policy/PolicyService";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class AuthorisationService {
  private static instance: AuthorisationService;
  private policyService: PolicyService;

  private constructor() {
    this.policyService = PolicyService.getInstance();
    console.log(this.policyService)
  }

  public static getInstance(): AuthorisationService {
    if (!AuthorisationService.instance) {
      AuthorisationService.instance = new AuthorisationService();
    }
    return AuthorisationService.instance;
  }

  public async authorize(userRoles: string[], httpMethod:HttpMethod, endpoint: string) {
    // check if user has access to endpoint
    const accessRole = await this.policyService.getPolicy(endpoint, httpMethod);
    console.log(accessRole);
    if (accessRole.length === 0) return; // Allow all to access
    if (!accessRole) {
      throw new Error("No Policy Exist");
    }
    console.log(userRoles);
    // check if user has access to resource
    if (userRoles===undefined || !userRoles.some((role) => accessRole.includes(role))) {
      throw new Error("Not authorized");
    }
  }
}

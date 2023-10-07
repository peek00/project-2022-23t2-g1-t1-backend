import { AuthenticationService } from "./AuthenticationService";

export class AuthorisationService {
  private static instance: AuthorisationService;
  private authenticationService: AuthenticationService;

  private constructor() {
    this.authenticationService = AuthenticationService.getInstance();
  }

  public static getInstance(): AuthorisationService {
    if (!AuthorisationService.instance) {
      AuthorisationService.instance = new AuthorisationService();
    }
    return AuthorisationService.instance;
  }

  public authorize(userRoles:[], accessRole: string[]) {
    if (accessRole.length === 0) {
      return;
    }
    // check if user has access to resource
    if (!userRoles.some(role => accessRole.includes(role))) {
      throw new Error("Not authorized");
    }
  }
}

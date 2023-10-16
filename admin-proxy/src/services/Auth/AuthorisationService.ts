export class AuthorisationService {
  private static instance: AuthorisationService;

  private constructor() {
  }

  public static getInstance(): AuthorisationService {
    if (!AuthorisationService.instance) {
      AuthorisationService.instance = new AuthorisationService();
    }
    return AuthorisationService.instance;
  }

  public authorize(userRoles: string[], accessRole: string[]) {
    if (accessRole.length === 0) {
      return;
    }
    // check if user has access to resource
    if (!userRoles.some((role) => accessRole.includes(role))) {
      throw new Error("Not authorized");
    }
  }
}

import { AuthorisationService } from "../../../src/services/Auth/AuthorisationService";

describe("AuthorisationService", () => {
  let authorisationService: AuthorisationService;

  beforeAll(() => {
    authorisationService = AuthorisationService.getInstance();
  });

  it("should be a singleton", () => {
    const authorisationService2 = AuthorisationService.getInstance();
    expect(authorisationService).toBe(authorisationService2);
  });

  describe("authorize", () => {
    it("should not throw error if user has access to resource", () => {
      const userRoles:string[] = ["admin"];
      const accessRole:string[] = ["admin"];
      expect(() => authorisationService.authorize(userRoles, accessRole)).not.toThrowError();
      const userRoles2:string[] = ["admin","superadmin","user"];
      const accessRole2:string[] = ["superadmin","system"];
      expect(() => authorisationService.authorize(userRoles2, accessRole2)).not.toThrowError();
    });

    it("should throw Not Authorize if user does not have access to resource", () => {
      const userRoles:string[] = ["admin"];
      const accessRole:string[] = ["superadmin"];
      expect(() => authorisationService.authorize(userRoles, accessRole)).toThrowError(
        "Not authorized"
      );
      const userRoles2:string[] = ["user"];
      const accessRole2:string[] = ["superadmin","system"];
      expect(() => authorisationService.authorize(userRoles2, accessRole2)).toThrowError(
        "Not authorized"
      );
    });
  });
});

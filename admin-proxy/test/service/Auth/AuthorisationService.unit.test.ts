import { AuthorisationService } from "../../../src/services/Auth/AuthorisationService";
import { PolicyService } from "../../../src/services/Policy/PolicyService";

describe("AuthorisationService", () => {
  let authorisationService: AuthorisationService;

  const policyServiceMock = {
    getPolicy: jest.fn().mockResolvedValue(["admin", "superadmin"]),
  };

  beforeAll(() => {
    PolicyService.getInstance = jest.fn().mockReturnValue(policyServiceMock);
    authorisationService = AuthorisationService.getInstance();    
  });

  it("should be a singleton", () => {
    const authorisationService2 = AuthorisationService.getInstance();
    expect(authorisationService).toBe(authorisationService2);
  });

  describe("authorize", () => {
    it("should not throw error if user has access to resource", () => {
      const userRoles:string[] = ["admin"];
      expect(() => authorisationService.authorize(userRoles,"GET", "/")).not.toThrowError();
      const userRoles2:string[] = ["superadmin"];
      expect(() => authorisationService.authorize(userRoles2, "GET","/")).not.toThrowError();
    });

    it("should throw Not Authorize if user does not have access to resource", () => {
      const userRoles:string[] = ["user"];
      expect(() => authorisationService.authorize(userRoles, "GET","/")).rejects.toThrowError("Not authorized");
      const userRoles2:string[] = ["","asda"];
      expect(() => authorisationService.authorize(userRoles2, "GET","/")).rejects.toThrowError("Not authorized");
    });
  });
});

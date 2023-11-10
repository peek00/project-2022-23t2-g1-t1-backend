import { AuthenticationService } from "../../../src/services/Auth/AuthenticationService";
import { JwtService } from "../../../src/services/Auth/JwtService";
import { Redis } from "../../../src/modules/CacheProvider/Redis";
import axios from "axios";

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService;
  const email = "test@test.com";

  // Mock cache provider
  const cacheProvider = {
    get: jest.fn().mockImplementation((key) => {
      return Promise.resolve(JSON.stringify({
        id: "1",
        role: ["admin"],
      }));
    }),
    write: jest.fn().mockImplementation((key, value, ttl) => {
      return Promise.resolve(true);
    }),
    remove: jest.fn().mockImplementation((key) => {
      return Promise.resolve(true);
    })
  };

  // Mock JWT service
  const jwtService = {
    generateToken: jest.fn().mockReturnValue("token"),
  };


  beforeAll(() => {
    // Mock Redis
    Redis.getInstance = jest.fn().mockReturnValue(cacheProvider);
    // Mock axios
    axios.get = jest.fn().mockResolvedValue({
      data: {
        id: "1",
        role: ["admin"],
      },
    });
    JwtService.getInstance = jest.fn().mockReturnValue(jwtService);
    authenticationService = AuthenticationService.getInstance();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should be a singleton", () => {
    const authenticationService2 = AuthenticationService.getInstance();
    expect(authenticationService).toBe(authenticationService2);
  })

  describe("authenticate", () => {
    it("should return user with token", async () => {
      // Assert that findUserByEmail is called
      const findUserByEmailSpy = jest.spyOn(
        authenticationService as any,
        "findUserByEmail",
      );      
      // Invoke authenticate
      const userWithToken = await authenticationService.authenticate(email);
      expect(findUserByEmailSpy).toBeCalledWith(email);

      const jwtServiceSpy = jest.spyOn(jwtService, "generateToken");
      expect(jwtServiceSpy).toBeCalledWith("1");

      // Assert cacheProvider.write
      expect(cacheProvider.write).toBeCalledWith(
        "1",
        JSON.stringify(userWithToken),
        3 * 24 * 60 * 60 * 1,
      );
      
      // Assert User
      expect(userWithToken).toEqual({
        id: "1",
        role: ["admin"],
        token: "token",
      });
    });
    it("should throw error if user not found", async () => {
      // Mock axios
      axios.get = jest.fn().mockResolvedValue({
        data: null,
      });
      // Invoke authenticate
      try {
        await authenticationService.authenticate(email);
      } catch (error) {
        expect((error as Error).message).toEqual("User not found");
      }
    });
  });

  describe("logout", () => {
    it("should remove user from cache", async () => {
      const removeSpy = jest.spyOn(cacheProvider, "remove");
      await authenticationService.logout("1");
      expect(removeSpy).toBeCalledWith("1");
    });
  });

  describe("getUserById", () => {
    it("should return user from cache if exists", async () => {
      const getSpy = jest.spyOn(cacheProvider, "get");
      await authenticationService.getUserById("1");
      expect(getSpy).toBeCalledWith("1");
    });

    it("should throw error if user not found", async () => {
      // Mock cacheProvider
      cacheProvider.get = jest.fn().mockResolvedValue(null);
      try {
        await authenticationService.getUserById("1");
      } catch (error) {
        expect((error as Error).message).toEqual("User Session not found");
      }
    });
  });
});

import { JwtService } from "../../../src/services/Auth/JwtService";
import jwt, { JwtPayload } from "jsonwebtoken";


describe("JwtService", () => {
  let jwtService: JwtService;

  beforeAll(() => {
    // STub JWT_SECRET from environment
    process.env.JWT_SECRET = 'secret'
    jwtService = JwtService.getInstance();
    // Use faketimer
    jest.useFakeTimers();
    // Set time to "2023-07-01T00:00:00.000Z"
    jest.setSystemTime(new Date(2023, 7, 1));
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    // Clear timers
    jest.clearAllTimers();
  });

  it("should be a singleton", () => {
    const jwtService2 = JwtService.getInstance();
    expect(jwtService).toBe(jwtService2);
  });

  describe("generateToken", () => {
    it("should return a token that expires 1 hour from intialisation", () => {
      const token = jwtService.generateToken("1");
      expect(token).toEqual(expect.any(String));

      // Get payload from token
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
      expect(payload).toEqual({
        id: "1",
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 60 * 60 * 24 * 3,
      });
    });
  });

  describe("validateJwtPayload", () => {
    it("should return true if the token is valid", () => {
      // Generate token
      const token = jwtService.generateToken("1");
      // Get payload from token
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      // Validate payload
      const result = jwtService.validateJwtPayload(payload);
      expect(result).toBe(true);
    });
    it("should throw Invalid token Error if payload is invalid", () => {
      const payload = "invalid payload";
      expect(() => jwtService.validateJwtPayload(payload as unknown as JwtPayload)).toThrowError("Invalid token");
    });
    it("should throw Token Expired Error if payload is valid but expired", () => {
      // Generate token
      const token = jwtService.generateToken("1");
      // Get payload from token
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      // Set time to "2023-08-01T01:00:00.000Z"
      jest.setSystemTime(new Date(2023, 8, 1, 1));
      expect(() => jwtService.validateJwtPayload(payload)).toThrowError("Token expired");
    });
  });
  
});

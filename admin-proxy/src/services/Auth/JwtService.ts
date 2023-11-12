import jwt, { JwtPayload } from "jsonwebtoken";
import { InvalidSessionError } from "../../middleware/error/customError";

export class JwtService {
  private static instance: JwtService;
  private secret: string;

  private constructor() {
    this.secret = process.env.JWT_SECRET as string;
    console.log(this.secret);
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  public generateToken(userId: string): string {
    console.log("JwtService.generateToken()");
    const token = jwt.sign({ id: userId }, this.secret, {
      expiresIn: 3 * 24 * 60 * 60 * 1, // 3 days
    });
    return token;
  }

  public validateJwtPayload(payload: JwtPayload) {
    // Validate JWT Token
    console.log(payload);
    console.log(typeof payload);
    console.log(payload.id);
    console.log(payload.exp);
    if (typeof payload === "string" || !payload.id || !payload.exp) {
      throw new InvalidSessionError("Invalid token");
    }
    // Verify Expiry
    const now = Date.now().valueOf() / 1000;
    if (typeof payload.exp !== "undefined" && payload.exp < now) {
      throw new InvalidSessionError("Token expired");
    }
    return true;
  }
}

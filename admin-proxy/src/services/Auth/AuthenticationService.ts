import { JwtService } from "./JwtService";
import ICacheProvider from "../../modules/CacheProvider/CacherProviderInterface";
import axios from "axios";
import { Redis } from "../../modules/CacheProvider/Redis";
import { config } from "../../config/config";
import { InvalidSessionError, UnauthorizedError } from "../../middleware/error/customError";
const { ProxyPaths } = config;

export interface UserWithToken {
  id: string;
  role: string[];
  token: string;
  fullName?: string;
}

export class AuthenticationService {
  private static instance: AuthenticationService;
  private jwtService: JwtService;
  private cacheProvider: ICacheProvider;

  private constructor() {
    this.jwtService = JwtService.getInstance();
    this.cacheProvider = Redis.getInstance();
  }
  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }
  public async authenticate(email: string): Promise<UserWithToken> {
    // Invoke User Proxy to retrieve user details
    try {
      const user = await this.findUserByEmail(email);
      const { userId, roles = [], fullName } = user;
      if (process.env.NODE_ENV !== 'production') console.log("UserID, role: "+ userId,roles);
      // If not, generate a new token and store it in cache
      const token = this.jwtService.generateToken(userId);
      const userWithToken = {
        id: userId,
        role: roles,
        token: token,
        fullName
      };
      // Flush old token in DB
      await this.cacheProvider.remove(userId);
      await this.cacheProvider.write(userId, JSON.stringify(userWithToken), 3 * 24 * 60 * 60 * 1); // 3 day
      return userWithToken;
    } catch (error) {
      throw new UnauthorizedError("User not found");
    }
  }
  private async findUserByEmail(email: string): Promise<any> {
    try {
      if (process.env.NODE_ENV !== 'production') console.log(`${ProxyPaths.userProxy}/User/getUserByEmail?email=${email}`);
      const user = await axios.get(`${ProxyPaths.userProxy}/User/getUserByEmail?email=${email}`);
      if (!user.data || !user.data.data) {
        throw new Error("User not found");
      }
      return user.data.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.log("Axios error: " + error); 
      throw error;
    }
  }
  public async logout(id: string): Promise<boolean> {
    if (process.env.NODE_ENV !== 'production') console.log("authenticationService.logout", id);
    await this.cacheProvider.remove(id);
    return true;
  }
  public async getUserById(id: string): Promise<any> {
    if (process.env.NODE_ENV !== 'production') console.log("authenticationService.getUserById", id);
    const userData = await this.cacheProvider.get(id);

    if (userData) {
      const { id, role, fullName, token } = JSON.parse(userData);
      // Check if JWT Token is the same as session

      return { id, role, fullName, token };
    } else {
      throw new InvalidSessionError("User Session not found");
    }
  }
  public async generateTemporaryToken(roleLs:string[]): Promise<UserWithToken> {
    const token = this.jwtService.generateToken("temporary");
    const response = { id: "temporary", role: roleLs, fullName: 'testName', token };
    if (process.env.NODE_ENV !== 'production') console.log(response);
    await this.cacheProvider.write("temporary", JSON.stringify(response), 60 * 3); // 3 minutes
    return response;
  }
}

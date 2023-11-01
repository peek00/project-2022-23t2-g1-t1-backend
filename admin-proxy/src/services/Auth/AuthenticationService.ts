import { JwtService } from "./JwtService";
import ICacheProvider from "../../modules/CacheProvider/CacherProviderInterface";
import axios from "axios";
import { Redis } from "../../modules/CacheProvider/Redis";
import { config } from "../../config/config";
const { ProxyPaths } = config;

export interface UserWithToken {
  id: string;
  role: string[];
  token: string;
  companyId?: string;
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
      const { id, role = [], companyId } = user;
      // If not, generate a new token and store it in cache
      const token = this.jwtService.generateToken(id);
      const response = { ...user, token };
      await this.cacheProvider.write(id, JSON.stringify(response), 60 * 60 * 1); // 1 hour
      return { id, role, companyId, token };
    } catch (error) {
      throw error;
    }
  }
  private async findUserByEmail(email: string): Promise<any> {
    try {
      const user = await axios.get(`${ProxyPaths.userProxy}/User/getUserByEmail?email=${email}`);
      console.log(user);
      if (!user.data) {
        throw new Error("User not found");
      }
      return user.data;
    } catch (error) {
      throw error;
    }
  }
  public async logout(id: string): Promise<boolean> {
    console.log("authenticationService.logout", id);
    await this.cacheProvider.remove(id);
    return true;
  }
  public async getUserById(id: string): Promise<any> {
    console.log("authenticationService.getUserById", id);
    const userData = await this.cacheProvider.get(id);

    if (userData) {
      const { id, role, companyId, token } = JSON.parse(userData);
      return { id, role, companyId, token };
    } else {
      throw new Error("User Session not found");
    }
  }
  public async generateTemporaryToken(roleLs:string[]): Promise<UserWithToken> {
    const token = this.jwtService.generateToken("temporary");
    const response = { id: "temporary", role: roleLs, companyId: 'test-company-id', token };
    console.log(response);
    await this.cacheProvider.write("temporary", JSON.stringify(response), 60 * 3); // 3 minutes
    return response;
  }
}

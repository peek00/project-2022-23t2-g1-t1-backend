import { createClient, RedisClientType, createCluster, RedisClusterType } from "redis";
import ICacheProvider from "./CacherProviderInterface";
import { promisify } from "util";

const username = process.env.REDIS_USER || "default";
const password = process.env.REDIS_PASS || "password";
const host = process.env.REDIS_HOST || "localhost";
const port = Number(process.env.REDIS_PORT) || 6379;

export class Redis implements ICacheProvider {
  private static instance: Redis;
  private client: any;
  private connected: boolean = false;

  private constructor() {
    if (process.env.NODE_ENV !== 'production') {
      this.client = createClient({
        url: `redis://${username}:${password}@${host}:${port}`,
        legacyMode: true,
      });
    } else {
      // Create Redis Cluster
      this.client = createCluster({
        rootNodes: [{
          url: `redis://${username}:${password}@${host}:${port}`,
          legacyMode: true,
        }],
      });
    }
    this.client.connect().then(() => {
      this.connected = true;
    }).catch((err:any) => {
      console.log((err as Error).message);
    });
  }

  public static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }

  public async get(key: string): Promise<string | null> {
    const value = await promisify(this.client.get).bind(this.client)(key);
    return value;
  }

  public async write(
    key: string,
    value: any,
    ttl: number = 1000,
  ): Promise<boolean> {
    try {
      console.log(key, value, ttl);
      if (ttl === -1) {
        await promisify(this.client.set).bind(this.client)(key, value);
        return true;
      }
      await promisify(this.client.set).bind(this.client)(key, value, "EX", ttl);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async remove(key: string): Promise<boolean> {
    await promisify(this.client.del).bind(this.client)(key);
    return true;
  }

  public async flush(): Promise<boolean> {
    try{
      await promisify(this.client.flushall).bind(this.client)();
    }catch (e) {
      await promisify(this.client.flushAll).bind(this.client)();
      console.log(e);
      return false;
    }
    return true;
  }
}

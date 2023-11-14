import { createClient, RedisClientType, SetOptions } from "redis";
import ICacheProvider from "./CacherProviderInterface";
import { promisify } from "util";

const username = process.env.REDIS_USER || "default";
const password = process.env.REDIS_PASS || "password";
const host = process.env.REDIS_HOST || "localhost";
const port = Number(process.env.REDIS_PORT) || 6379;

export class Redis implements ICacheProvider {
  private static instance: Redis;
  private client: RedisClientType;
  private connected: boolean = false;

  private constructor() {
    if (process.env.NODE_ENV === "production") {
      this.client = createClient({
        url: `redis://${host}:${port}`,
        legacyMode: true,
      });
    } else{
      this.client = createClient({
        url: `redis://${username}:${password}@${host}:${port}`,
        legacyMode: true,
      });
    }
    this.client.connect().then(() => {
      if (process.env.NODE_ENV !== 'production') //console.log("Connected to Redis");
      this.connected = true;
    }).catch((e) => {
      if (process.env.NODE_ENV !== 'production') //console.log(e);
      this.connected = false;
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
      if (process.env.NODE_ENV !== 'production') //console.log(key, value, ttl);
      if (ttl === -1) {
        await promisify(this.client.set).bind(this.client)(key, value);
        return true;
      }
      await promisify(this.client.set).bind(this.client)(key, value, "EX", ttl);
      return true;
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') //console.log(e);
      return false;
    }
  }

  public async remove(key: string): Promise<boolean> {
    await promisify(this.client.del).bind(this.client)(key);
    return true;
  }

  public async flush(): Promise<boolean> {
    await promisify(this.client.flushAll).bind(this.client)();
    return true;
  }

  async flushAllMatchingPattern(pattern: string): Promise<boolean> {
    const keys = await promisify(this.client.keys).bind(this.client)(pattern);
    if (process.env.NODE_ENV !== 'production') //console.log("Deleting all cache matching log pattern")
    if (process.env.NODE_ENV !== 'production') //console.log(keys);
    if (keys.length === 0) {
      return true;
    }
    // Delete all keys matching pattern
    await promisify(this.client.del).bind(this.client)(keys);
    return true;
  }
}

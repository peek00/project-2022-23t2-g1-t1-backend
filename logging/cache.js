import { createClient } from "redis";
import { promisify } from "util";

const username = process.env.REDIS_USER || "default";
const password = process.env.REDIS_PASS || "password";
const host = process.env.REDIS_HOST || "localhost";
const port = Number(process.env.REDIS_PORT) || 6379;

export class Redis {
  static instance;
  client;
  connected = false;

  constructor() {
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
      console.log("Connected to Redis");
      this.connected = true;
    }).catch((e) => {
      console.log(e);
      this.connected = false;
    });
  }

  static getInstance() {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }

  async get(key) {
    const value = await promisify(this.client.get).bind(this.client)(key);
    return value;
  }

  async write(
    key,
    value,
    ttl = 1000,
  ){
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

  async remove(key) {
    await promisify(this.client.del).bind(this.client)(key);
    return true;
  }

  async flush() {
    await promisify(this.client.flushAll).bind(this.client)();
    return true;
  }

  async flushAllMatchingLogPattern(){
    const logPattern = "logs*";
    const keys = await promisify(this.client.keys).bind(this.client)(logPattern);
    console.log("Deleting all cache matching log pattern")
    console.log(keys);
    if (keys.length === 0) {
      return true;
    }
    // Delete all keys matching pattern
    await promisify(this.client.del).bind(this.client)(keys);
  }
}

export const createCacheClient = () => {
  const cache =  Redis.getInstance();
  return cache;
}
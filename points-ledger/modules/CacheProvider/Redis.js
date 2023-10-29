const { promisify } = require("util");
// const { createClient, RedisClientType, SetOptions } = require('redis');
const redis = require('redis')

const username = process.env.REDIS_USER || "default";
const password = process.env.REDIS_PASS || "password";
const host = process.env.REDIS_HOST || "localhost";
const port = Number(process.env.REDIS_PORT) || 6379;

class Redis {
    constructor() {
        this.client = redis.createClient({
        //   url: `redis://${username}:${password}@${host}:${port}`,
        url: `redis://${username}:${password}@${host}:${port}`,
        legacyMode: true,
        });
        this.client.connect().then(() => {
          this.connected = true;
        }).catch((err) => {
          console.log(err);
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
    ) {
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
}

module.exports = { Redis }; 
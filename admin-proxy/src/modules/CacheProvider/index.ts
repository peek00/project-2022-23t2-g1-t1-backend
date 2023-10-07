import { Redis } from "./Redis";

const cacheProvider = Redis.getInstance();

export { cacheProvider };

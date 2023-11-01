// import { Redis } from "./Redis";
const {Redis} = require("./Redis");

const cacheProvider = Redis.getInstance();

export { cacheProvider };
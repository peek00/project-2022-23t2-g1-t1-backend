import express, { Application } from "express";
import passport from "./middleware/auth/passport";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/error/error";
import router from "./routes";
import { PolicyService } from "./services/Policy/PolicyService";
import { Logger } from "./services/Logger/Logger";
import authorize from "./middleware/auth/authorize";
import cron from "node-cron";
import axios from "axios";
import { config } from "./config/config";

//For env File
dotenv.config();

const app: Application = express();
const host = "0.0.0.0";
const port = Number(process.env.PORT) || 8000;

// Initialize Policy Service
PolicyService.initialize().then(() => {
  console.log("Policy Service Initialized");
  // Adding Passport
  app.use(passport.initialize());
  app.use(
    // cors({
    //   origin: process.env.CLIENT_BASE_URL,
    //   credentials: true,
    // }),
    cors()
  );

  // Add Proxy Middleware
  app.use("/health",(req, res) => {
    res.send('health check');
  })
  app.use("/",authorize(), router);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(errorHandler);

  app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Schedule a cron job to run at the start of every minute
  cron.schedule("*/60 * * * * *", () => {
    // Trigger reinitialization of logger
    console.log("Reinitializing Logger");
    Logger.getInstance().createLogger();

    // Test api request to MS
    axios.get(`${config.ProxyPaths.loggingProxy}`).then((res) => {
      console.log("Logging Proxy Health Check Passed");
      console.log(res.data);
    }).catch((err) => {
      console.log("Logging Proxy Health Check Failed");
      console.log(err);
    });
    axios.get(`${config.ProxyPaths.userProxy}`).then((res) => {
      console.log("Logging Proxy Health Check Passed"); 
      console.log(res.data);
    }).catch((err) => {
      console.log("Logging Proxy Health Check Failed");
      console.log(err);
    });
  });

}).catch((err) => {
  console.log("Error initializing Policy Service");
  console.log(err);
  process.exit(1);
});

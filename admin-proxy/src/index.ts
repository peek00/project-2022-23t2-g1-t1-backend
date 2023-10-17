import express, { Application } from "express";
import passport from "./middleware/auth/passport";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/error/error";
import router from "./routes";
import { PolicyService } from "./services/Policy/PolicyService";
import authorize from "./middleware/auth/authorize";

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
    cors({
      origin: process.env.CLIENT_BASE_URL,
      credentials: true,
    }),
  );

  // Add Proxy Middleware
  app.use("/",authorize(), router);
  app.use(errorHandler);

  app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
  });

}).catch((err) => {
  console.log("Error initializing Policy Service");
  console.log(err);
  process.exit(1);
});

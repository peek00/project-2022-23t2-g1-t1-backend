import express, { Application } from "express";
import http from "http";
import passport from "./middleware/auth/passport";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/error/error";
import router from "./routes";
import { PolicyService } from "./services/Policy/PolicyService";
import { Logger } from "./services/Logger/Logger";
import cron from "node-cron";
import compression from "compression";
import rateLimiter from "./middleware/ratelimit/rateLimiter";

//For env File
dotenv.config();

const app: Application = express();
const host = "0.0.0.0";
const port = Number(process.env.PORT) || 8000;

app.use(cors({
  origin: ['*',process.env.CLIENT_BASE_URL as string],
  credentials: true, 
}));
app.use(compression());

// Initialize Policy Service
PolicyService.initialize().then(() => {
  if (process.env.NODE_ENV !== 'production') console.log("Policy Service Initialized");
  if (process.env.NODE_ENV !== 'production') console.log(process.env.CLIENT_BASE_URL);
  // Adding Passport
  app.use(passport.initialize());
  
  // Add Proxy Middleware
  app.use("/health", rateLimiter, (req, res) => {
    // Display Client IP Address
    if (process.env.NODE_ENV !== 'production') console.log(req.ip);

    res.status(200).json({
      message: "OK",
      IP: {
        ip: req.ip,
        'X-Forwarded-For': req.headers['x-forwarded-for'],
      },
    });
  })
  app.use("/", router);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(errorHandler);

  const server = http.createServer(app);
  
  // // Set Max Connections
  server.maxConnections = 1000;

  // Kill idle connections
  server.on('connection', (socket) => {
    socket.setTimeout(5000);
    socket.on('timeout', () => {
      socket.destroy(new Error('connection timeout'));
    });
  });

  // Manage Connection pool
  server.listen(port, host, () => {
    console.log(`Server started at http://${host}:${port}`);
  });


  // Schedule a cron job to run at the start of every minute
  cron.schedule("*/60 * * * * *", () => {
    // Trigger reinitialization of logger 
    if (process.env.NODE_ENV !== 'production') console.log("Reinitializing Logger");
    Logger.getInstance().createLogger();
  });

}).catch((err) => {
  console.error("Error initializing Policy Service: ",err.message);
  process.exit(1);
});

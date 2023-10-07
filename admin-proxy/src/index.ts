import express, { Application } from "express";
import passport from "./middleware/auth/passport";
import dotenv from "dotenv";
import cors from "cors";
import { config } from "./config/config";
import { errorHandler } from "./middleware/error/error";
import router from "./routes";
import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { userAuditLogger } from "./services/Logger";
import authorize from "./middleware/auth/authorize";

//For env File
dotenv.config();

const app: Application = express();
const host = '0.0.0.0';
const port = Number(process.env.PORT) || 8000;

// Adding Passport
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

const myProxy = createProxyMiddleware({
  target: process.env.microservice1 || "http://localhost:3002",
  changeOrigin: false,
  pathRewrite: {
    [`^/2`]: "",
  },
  selfHandleResponse: true,
  onProxyReq: (proxyReq, req, res) => {
    req.headers["x-auth-user"] = req.user!.id;
  },
  onProxyRes: responseInterceptor(
    async (responseBuffer, proxyRes, req, res) => {
      const response = responseBuffer.toString("utf8");
      const userId = req.headers["x-auth-user"] as string;
      userAuditLogger.logRequest(
        proxyRes.statusCode || 500,
        response,
        req as any,
        userId
      );
      // Remove x-auth-user from response header
      res.removeHeader("x-auth-user");
      return responseBuffer;
    },
  ),
  onError: (err, req, res) => {
    res.writeHead(500, {
      "Content-Type": "text/plain",
    });
    res.end(
      "Something went wrong. And we are reporting a custom error message.",
    );
  },
});

// Add Proxy Middleware
app.use("/2", authorize(["superadmin","admin"]), myProxy);

app.use(router);
app.use(errorHandler);

app.listen(port,host, () => {
  console.log(`Server is running on port ${port}`);
})

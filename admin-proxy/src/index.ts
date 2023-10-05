import express, { Application, Request, Response } from "express";
import passport from "./middleware/auth/passport";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import cors from "cors";
import { config } from "./config/config";
import { errorHandler } from "./middleware/error/error";
import router from "./routes";
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import { userAuditLogger } from "./services/Logger";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
const { COOKIE_KEY } = config;

// Adding cookieSession
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [COOKIE_KEY],
  }),
);

// Adding Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Add Proxy Middleware
app.use(
  createProxyMiddleware('/2',{
    target: process.env.microservice1 || "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: {
      [`^/2`]: '',
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      const response = responseBuffer.toString('utf8');
      userAuditLogger.logRequest(proxyRes.statusCode || 500, response, req as any);
      return responseBuffer;
    }),
    onError: (err, req, res) => {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Something went wrong. And we are reporting a custom error message.');
    }
  }),
);

app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Server is live at http://${process.env.HOSTNAME || "localhost"}:${port}`,
  );
});

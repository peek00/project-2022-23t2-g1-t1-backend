import { RequestHandler, createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import AuditLogger from "../../services/Logger/AuditLogger";

export class ProxyController{
  private proxy: RequestHandler;

  constructor(target: string, path: string, logger: AuditLogger){
    this.proxy = createProxyMiddleware({
      target: target,
      changeOrigin: false,
      pathRewrite: {
        [`^${path}`]: "",
      },
      selfHandleResponse: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log("onProxyReq", req.user);
        console.log("target", target);
        req.headers["x-auth-user"] = req.user!.id;
      },
      onProxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          const response = responseBuffer.toString("utf8");
          const userId = req.headers["x-auth-user"] as string;
          console.log("response", response);
          logger.logRequest(
            proxyRes.statusCode || 500,
            response,
            req as any,
            userId,
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
  }

  public getProxy(): RequestHandler{
    return this.proxy;
  }
}
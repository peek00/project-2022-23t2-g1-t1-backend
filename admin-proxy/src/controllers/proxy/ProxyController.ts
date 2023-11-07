import { RequestHandler, createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import AuditLogger from "../../services/Logger/AuditLogger";

export class ProxyController{
  private proxy: RequestHandler;

  constructor(target: string, path: string, logger?: AuditLogger){
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
        req.headers["userid"] = req.user!.id;
        proxyReq.setHeader("userid", req.user!.id);
        // proxyReq.setHeader("companyid", req.user!.companyId || "808aa552-94cf-4a0a-b17f-6c8b3bf50c85");
        proxyReq.setHeader("role", JSON.stringify(req.user!.role || ["User"]));
      },
      onProxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          const response = responseBuffer.toString("utf8");
          const userId = req.headers["userid"] as string;
          console.log("response", response);
          if (logger === undefined) return responseBuffer; // For routes without logging
          try {
            let responseDetails = JSON.parse(response);
            if (!responseDetails || responseDetails.logInfo === undefined) return responseBuffer;

            logger.logRequest(
              proxyRes.statusCode || 500,
              responseDetails.logInfo,
              req as any,
              userId,
            );
            // Remove x-auth-user from response header
            res.removeHeader("userid");
            res.removeHeader("companyid");
            res.removeHeader("role");
            // Remove logInfo from responseDetails and send as new response Buffer
            delete responseDetails.logInfo;
            return Buffer.from(JSON.stringify(responseDetails));
          } catch (error) {
            console.error(error);
            return responseBuffer;
          }

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
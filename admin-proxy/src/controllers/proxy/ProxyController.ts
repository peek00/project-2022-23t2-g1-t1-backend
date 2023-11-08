import { RequestHandler, createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import AuditLogger from "../../services/Logger/AuditLogger";

export class ProxyController{
  private proxy: RequestHandler;

  constructor(target: string, path: string, logger?: AuditLogger){
    this.proxy = createProxyMiddleware({
      target: target,
      changeOrigin: true,
      pathRewrite: {
        [`^${path}`]: "",
      },
      selfHandleResponse: true,
      xfwd: true,
      onProxyReq: (proxyReq, req, res) => {
        // console.log("Original Req IP", req.ip);
        // console.log("onProxyReq", req.user);
        // console.log("target", target);
        // req.headers["userid"] = req.user!.id;
        proxyReq.setHeader("userid", req.user!.id);
        proxyReq.setHeader("originalip", req.ip);
        proxyReq.setHeader("role", JSON.stringify(req.user!.role || ["User"]));
        req.headers["userid"] = req.user!.id;
        req.headers["originalip"] = req.ip;
      },
      onProxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          const response = responseBuffer.toString("utf8");
          const userId = req.headers["userid"] as string;
          let originalIP = "";
          // If X-Forwarded-For header is present
          if (req.headers["X-Forwarded-For"]) {
            console.log("X-Forwarded-For header present: ", req.headers["X-Forwarded-For"]);
            originalIP = req.headers["X-Forwarded-For"] as string;
          } else {
            originalIP = req.headers["originalip"] as string;
          }
          console.log("response", response);
          if (logger === undefined) return responseBuffer; // For routes without logging
          try {
            let responseDetails = JSON.parse(response);
            if (!responseDetails || responseDetails.logInfo === undefined) return responseBuffer;

            logger.logRequest(
              proxyRes.statusCode || 500,
              responseDetails.logInfo,
              req as any,
              originalIP,
              userId,
            );
            // Remove x-auth-user from response header
            res.removeHeader("userid");
            res.removeHeader("role");
            res.removeHeader("originalIP");
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
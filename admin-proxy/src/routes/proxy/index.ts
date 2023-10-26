import { Router } from "express";
import { userProxy, pointsProxy, makerCheckerProxy, loggingProxy } from "../../controllers/proxy";

const proxyRouter = Router();

proxyRouter.use(
  "/user", 
  userProxy.getProxy()
);

proxyRouter.use(
  "/points", 
  pointsProxy.getProxy()
);

proxyRouter.use(
  "/maker-checker", 
  makerCheckerProxy.getProxy()
);

proxyRouter.use(
  "/logging", 
  loggingProxy.getProxy()
);

export default proxyRouter;

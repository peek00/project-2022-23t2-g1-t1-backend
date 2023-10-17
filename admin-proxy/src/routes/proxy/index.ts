import { Router } from "express";
import { userProxy, pointsProxy, makerCheckerProxy } from "../../controllers/proxy";

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

export default proxyRouter;

import { Router } from "express";
import authorize from "../../middleware/auth/authorize";
import { userProxy, pointsProxy, makerCheckerProxy } from "../../controllers/proxy";

const proxyRouter = Router();

proxyRouter.use("/user", authorize(), userProxy.getProxy());
proxyRouter.use("/points", authorize(), pointsProxy.getProxy());
proxyRouter.use("/maker-checker", authorize(), makerCheckerProxy.getProxy());


export default proxyRouter;

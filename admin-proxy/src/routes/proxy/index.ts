import { Router } from "express";
import { userProxy, pointsProxy, makerCheckerProxy, loggingProxy } from "../../controllers/proxy";
import { Redis } from "../../modules/CacheProvider/Redis";

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

proxyRouter.use(
  '/flush',
  async (req, res, next) => {
    try {
      await Redis.getInstance().flush();
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500).json({
        message: (error as Error).message
      });
    }
  }
)

export default proxyRouter;

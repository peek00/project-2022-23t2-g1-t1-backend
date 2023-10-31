import { Router } from "express";
import authRouter from "./auth";
import proxyRouter from "./proxy";
import policyRouter from "./policy";

const router = Router();
router.get('/', (req, res) => {
  res.send('health check');
});
router.use("/auth", authRouter);
router.use("/api", proxyRouter);
router.use("/policy", policyRouter);

export default router;

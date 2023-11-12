import { Router } from "express";
import authRouter from "./auth";
import proxyRouter from "./proxy";
import policyRouter from "./policy";
import authorize from "../middleware/auth/authorize";


const router = Router();
router.use("/auth", authRouter);
router.use("/api", authorize(), proxyRouter);
router.use("/policy", authorize(), policyRouter);

export default router;

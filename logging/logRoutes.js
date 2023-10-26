import { Router } from "express";
import * as logController from "./logController.js";

const router = Router();

router.get("/", logController.getAllLogs);

export default router;
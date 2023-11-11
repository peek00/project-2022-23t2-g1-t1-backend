import { Router } from "express";
import * as logController from "./logController.js";

const router = Router();

router.get("/", logController.getAllLogs);
router.get("/group", logController.getAllLogGroups);

export default router;
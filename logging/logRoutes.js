import { Router } from "express";
import * as logController from "./logController.js";
import * as fileController from "./processFileController.js";

const router = Router();

router.get("/", logController.getAllLogs);
router.get("/group", logController.getAllLogGroups);
router.get("/clear", fileController.clearAllLogs);

export default router;
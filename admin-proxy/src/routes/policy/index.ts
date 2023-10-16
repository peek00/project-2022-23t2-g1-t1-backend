import { Router } from "express";
import policyController from "../../controllers/policy";
import authorize from "../../middleware/auth/authorize";

const policyRouter = Router();
policyRouter.get("/", authorize(), policyController.listExistingPolicy);
policyRouter.post("/", authorize(), policyController.createNewPolicy);
policyRouter.put("/", authorize(), policyController.updateExistingPolicy);

export default policyRouter;

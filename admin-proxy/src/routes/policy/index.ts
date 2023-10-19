import { Router } from "express";
import policyController from "../../controllers/policy";

const policyRouter = Router();

policyRouter.get(
  "/", 
  policyController.listExistingPolicy
);

policyRouter.post(
  "/", 
  policyController.createNewPolicy
);

policyRouter.put(
  "/", 
  policyController.updateExistingPolicy
);

policyRouter.delete(
  "/", 
  policyController.deleteExistingPolicy
);

export default policyRouter;

import express, { Router } from "express";
import policyController from "../../controllers/policy";

const policyRouter = Router();
policyRouter.use(express.json());
policyRouter.use(express.urlencoded({ extended: true }));

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

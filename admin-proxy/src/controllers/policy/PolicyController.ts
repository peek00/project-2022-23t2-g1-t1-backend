import { Request, Response, NextFunction } from "express";
import { PolicyService } from "../../services/Policy/PolicyService";

export class PolicyController {

  constructor() {
  }

  public async listExistingPolicy(req:Request, res:Response, next:NextFunction): Promise<any> {
    try {
      console.log("listExistingPolicy");
      const policy = await PolicyService.getInstance().getAllPolicies();
      res.status(200).json(policy);
    } catch (error) {
      next(error);
    }
  }

  public async createNewPolicy(req:Request, res:Response, next:NextFunction): Promise<any> {
    try {
      const { endpoint, GET, POST, PUT, DELETE } = req.body;
      if (endpoint === undefined || GET === undefined || POST === undefined || PUT === undefined || DELETE === undefined) {
        throw new Error("Invalid policy");
      }
      await PolicyService.getInstance().add({ endpoint, GET, POST, PUT, DELETE });
      res.status(200).json({ endpoint, GET, POST, PUT, DELETE });
    } catch (error) {
      next(error);
    }
  }

  public async updateExistingPolicy(req:Request, res:Response, next:NextFunction): Promise<any> {
    try {
      const { endpoint } = req.body;
      if (endpoint === undefined) {
        throw new Error("Invalid policy");
      }
      const policy = await PolicyService.getInstance().update(req.body);
      res.status(200).json(policy);
    } catch (error) {
      next(error);
    }
  }

  public async deleteExistingPolicy(req:Request, res:Response, next:NextFunction): Promise<any> {
    try {
      const { endpoint } = req.body;
      console.log(endpoint);
      if (endpoint === undefined) {
        throw new Error("Invalid policy");
      }
      const policy = await PolicyService.getInstance().delete(req.body);
      res.status(200).json(policy);
    } catch (error) {
      next(error);
    }
  }

  public async mapUserPolicy(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { role } = req.user!;
      const { pageLs } = req.body;
      if (pageLs === undefined) {
        throw new Error("Invalid Request");
      }
      const userPolicy = await PolicyService.getInstance().mapRoleActions(role, pageLs);
      res.status(200).json(userPolicy);
    } catch (error) {
      next(error);
    }
  }

}
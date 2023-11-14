import { Request, Response, NextFunction } from "express";
import { PolicyService } from "../../services/Policy/PolicyService";

export class PolicyController {

  constructor() {
  }

  public async listExistingPolicy(req:Request, res:Response, next:NextFunction): Promise<any> {
    try {
      if (process.env.NODE_ENV !== 'production') //console.log("listExistingPolicy");
      let response: any = {}
      const policy = await PolicyService.getInstance().getAllPolicies();
      policy.forEach((p: any) => {
        let endpoint = p.endpoint;
        delete p.endpoint;
        response[endpoint] = p;
      });
      res.status(200).json(response);
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
      if (process.env.NODE_ENV !== 'production') //console.log(endpoint);
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
      if (process.env.NODE_ENV !== 'production') //console.log(`getUserPolicyMapping for ${pageLs} based on user role ${role}`)
      if (pageLs === undefined || role === undefined) {
        throw new Error("Invalid Request");
      }
      const userPolicy = await PolicyService.getInstance().mapRoleActions(role, pageLs);
      res.status(200).json(userPolicy);
    } catch (error) {
      next(error);
    }
  }

}
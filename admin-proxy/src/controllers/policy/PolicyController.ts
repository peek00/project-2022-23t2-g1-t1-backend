import { Request, Response, NextFunction } from "express";
import { PolicyService } from "../../services/Policy/PolicyService";

interface Policy {
  path: string;
  GET: string[];
  POST: string[];
  PUT: string[];
  DELETE: string[];
}

export class PolicyController {

  constructor() {
  }

  public parsePolicy(body: any): Policy {
    const { path, GET, POST, PUT, DELETE } = body;
    if (path === undefined || GET === undefined || POST === undefined || PUT === undefined || DELETE === undefined) {
      throw new Error("Invalid policy");
    }
    return {
      path,
      GET: GET.split(","),
      POST: POST.split(","),
      PUT: PUT.split(","),
      DELETE: DELETE.split(","),
    };
  }

  public async listExistingPolicy(req:Request, res:Response, next:NextFunction): Promise<any> {
    try {
      console.log("listExistingPolicy");
      const policy = await PolicyService.getInstance().findAll();
      res.status(200).json(policy);
    } catch (error) {
      next(error);
    }
  }

  public async createNewPolicy(req:Request, res:Response, next:NextFunction): Promise<any> {
    try {
      const newPolicy = this.parsePolicy(req.body);
      const policy = await PolicyService.getInstance().add(newPolicy);
      res.status(200).json(policy);
    } catch (error) {
      next(error);
    }
  }

  public async updateExistingPolicy(req:Request, res:Response, next:NextFunction): Promise<any> {
    try {
      const policy = await PolicyService.getInstance().update(req.body);
      res.status(200).json(policy);
    } catch (error) {
      next(error);
    }
  }

}
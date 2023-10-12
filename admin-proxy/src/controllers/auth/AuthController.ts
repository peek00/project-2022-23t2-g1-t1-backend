import { Request, Response, NextFunction } from "express";
import { authenticationService } from "../../services/Auth";

export class AuthController {
  private static instance: AuthController;

  private constructor() {}

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      console.log("Logout ID", id);
      console.log("logout", authenticationService === undefined);
      const result = await authenticationService.logout(id);
      // Clear cookies from client
      res.clearCookie("jwt");
      res.json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  public async authCallback(req: Request, res: Response, next: NextFunction) {
    try {
      if (false && process.env.NODE_ENV === "production") {
        res.cookie("jwt", req.user!.token, { httpOnly: true });
        res.redirect(process.env.CLIENT_BASE_URL as string);
      } else {
        res.cookie("jwt", req.user!.token, { httpOnly: true });
        res.redirect("/auth/me");
      }
    } catch (error) {
      next(error);
    }
  }
}

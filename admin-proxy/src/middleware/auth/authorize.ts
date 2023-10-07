import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { authorisationService } from "../../services/Auth";


function authorize(accessRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: any, _info: any) => {
        console.log(user);
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).send({ error: "Unauthorized" });
        }
        const {role} = user;
        try {
          authorisationService.authorize(role, accessRoles);
          // Make user available in req.user
          req.user = user;
          console.log("authorisationService.authorize",req.user);
          next();
        }catch (error) {
          return next(error);
        }
      },
    )(req, res, next);
  };
}

export default authorize;

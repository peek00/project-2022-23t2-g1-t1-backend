import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { authorisationService } from "../../services/Auth";
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function authorize() {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: any, _info: any) => {
        console.log(user);
        if (err) {
          return next(err);
        }
        if (!user && !req.path.includes("/auth/google")) {
          return res.status(401).send({ error: "Unauthorized" });
        }
        const { role } = user;
        // Make user available in req.user
        console.log(req.method as HttpMethod, req.path)
        authorisationService.authorize(role, req.method as HttpMethod, req.path).then(() => {
          req.user = user;
          console.log("authorisationService.authorize", req.user);
          next();
        }).catch((error) => {
          return next(error);
        });
      },
    )(req, res, next);
  };
}

export default authorize;

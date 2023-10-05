import { Request, Response, NextFunction } from "express";
import passport from "passport";

function authenticate(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: any, _info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).send({ error: "Unauthorized" });
        }
        req.user = user;
        if (user.role !== requiredRole) {
          return next(new Error("Invalid role"));
        }
        next();
      },
    )(req, res, next);
  };
}

export default authenticate;

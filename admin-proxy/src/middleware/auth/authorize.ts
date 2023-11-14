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
        if (process.env.NODE_ENV !== 'production') //console.log(user);
        if (err) {
          return next(err);
        }
        const { role } = user;
        req.user = user;
        // Make user available in req.user
        // if (process.env.NODE_ENV !== 'production') //console.log(req.method as HttpMethod, req.path)
        let url = req.url.replace(process.env.API_BASE_URL as string, "")
        // Always allow user to access this endpoint if they are retrieving their own id
        if (url === `/api/user/User/getUser?userId=${user.id}`) {
          return next();
        }
        authorisationService.authorize(role, req.method as HttpMethod, url).then(() => {
          if (process.env.NODE_ENV !== 'production') //console.log("authorisationService.authorize", req.user);
          next();
        }).catch((error) => {
          if (process.env.NODE_ENV !== 'production') //console.log(error.message);
          return next(error);
        });
      },
    )(req, res, next);
  };
}

export default authorize;

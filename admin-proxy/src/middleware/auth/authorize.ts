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
        const { role } = user;
        req.user = user;
        // Make user available in req.user
        // console.log(req.method as HttpMethod, req.path)
        let url = req.url.replace(process.env.API_BASE_URL as string, "")
        // Always allow user to access this endpoint if they are retrieving their own id
        if (url === `/api/user/User/getUser?userId=${user.id}`) {
          return next();
        }
        authorisationService.authorize(role, req.method as HttpMethod, url).then(() => {
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

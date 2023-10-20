import { NextFunction, Request, Response, Router } from "express";
import authorize from "../../middleware/auth/authorize";
import passport from "../../middleware/auth/passport";
import { authController } from "../../controllers/auth";

const authRouter = Router();
authRouter.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    res.json(req.user);
  },
);

// Google Oauth Consent Screen
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Google Oauth Callback Route
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  authController.authCallback,
);

// Logout Route
authRouter.get(
  "/logout", 
  authController.logout);

export default authRouter;

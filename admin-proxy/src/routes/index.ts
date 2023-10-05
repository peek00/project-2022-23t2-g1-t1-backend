import { NextFunction, Request, Response, Router } from "express";
import authenticate from "../middleware/auth/authenticate";
import passport from "../middleware/auth/passport";
import jwt from "jsonwebtoken";

const router = Router();
router.get("/me", (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);
  res.json(req.user);
});

// Test JWT Auth route
router.get(
  "/test",
  authenticate("admin"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  },
);

// Google Oauth Consent Screen
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// Google Oauth Callback Route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google",
  }),
  (req: Request, res: Response) => {
    // Generate jwt token based on userid
    const token = jwt.sign(
      { id: req.user?.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: 60 * 60 * 1, // 1 hour
      },
    );
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect(process.env.CLIENT_BASE_URL as string);
  },
);

// Logout Route
router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  try {
    req.logOut(
      {
        keepSessionInfo: false,
      },
      (err) => {
        if (err) {
          throw err;
        }
      },
    );
    res.redirect(process.env.CLIENT_BASE_URL as string);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;

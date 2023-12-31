import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "../../config/config";
const GoogleOauth2Config = config.GoogleOauth2Config;
import { JwtPayload } from "jsonwebtoken";
import { authenticationService, jwtService } from "../../services/Auth";
import { InvalidSessionError } from "../error/customError";

export interface IProfile {
  id: string;
  displayName: string;
  email: string;
  provider: string;
}

const cookieExtractor = (req: any) => {
  if (process.env.NODE_ENV !== 'production') console.log("Retrieving from Cookie...");
  if (process.env.NODE_ENV !== 'production') console.log("Req.cookie", req.cookie);
  if (process.env.NODE_ENV !== 'production') console.log("Req.headers.cookie", req.headers.cookie);
  const cookies = req.headers.cookie?.split(";");
  let token = "";
  if (cookies && cookies.length) {
    cookies.forEach((cookie: string) => {
      const [key, value] = cookie.split("=");
      if (key.trim() === "jwt") {
        token = value;
      }
    });
  }
  if (process.env.NODE_ENV !== 'production') console.log("Token: ", token);
  if (token === "") {
    throw new InvalidSessionError("JWT Token is required in cookie, please login again");
  }
  return token;
};

const BearerTokenFromRequest = (req: any) => {
  if (process.env.NODE_ENV !== 'production') console.log("Retrieving from Bearer Token...");
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return authHeader.split(" ")[1];
  }
  throw new InvalidSessionError("JWT Token is required in Bearer Token, please login again");
}

const TokenExtractor = (req: any) => {
  // Check if the userAgent is Postman
  const userAgent = req.headers["user-agent"];
  if (process.env.NODE_ENV !== 'production') console.log("TokenExtractor Running: ")
  if (userAgent && userAgent.includes("Postman")) {
    return BearerTokenFromRequest(req);
  }
  return cookieExtractor(req);
}

// Configure JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([TokenExtractor]),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwtPayload: JwtPayload, done) => {
      try {
        jwtService.validateJwtPayload(jwtPayload);
        const user = await authenticationService.getUserById(jwtPayload.id);
        if (process.env.NODE_ENV !== 'production') console.log("User from JWT", user);
        jwtService.matchTokenPayload(user.token, jwtPayload);
        return done(null, user, { scope: "all" });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.log(error);
        return done(error, false);
      }
    },
  ),
);

// Configure GoogleOAuth Strategy
passport.use(
  new GoogleStrategy(
    GoogleOauth2Config,
    async (
      request,
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      const userProfile: IProfile = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails![0].value,
        provider: "google",
      };
      if (process.env.NODE_ENV !== 'production') console.log(userProfile);
      try {
        const user = await authenticationService.authenticate(
          userProfile.email,
        );
        done(null, user);
      } catch (error) {
        done(error as Error, undefined);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  if (process.env.NODE_ENV !== 'production') console.log(`Serialise: ${user}`)
  if (!user) {
    throw new Error("User not found");
  }
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await authenticationService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

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

export interface IProfile {
  id: string;
  displayName: string;
  email: string;
  provider: string;
}

const cookieExtractor = (req: any) => {
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
  console.log(token);
  return token;
};

// Configure JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwtPayload: JwtPayload, done) => {
      try {
        jwtService.validateJwtPayload(jwtPayload);
        const user = await authenticationService.getUserById(jwtPayload.id);
        return done(null, user, { scope: "all" });
      } catch (error) {
        console.log(error);
        return done(new Error(`Invalid token: ${(error as Error).message}`));
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
      // Invoke API request to User Microservice to retrieve or create user
      // Mocking user for now
      // console.log(profile)
      const userProfile: IProfile = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails![0].value,
        provider: "google",
      };
      // console.log(userProfile);
      try {
        const user = await authenticationService.authenticate(
          userProfile.email,
        );
        console.log(user);
        done(null, user);
      } catch (error) {
        done(error as Error, undefined);
      }
      // const user = await getOrCreateUser(userProfile);
    },
  ),
);

passport.serializeUser((user, done) => {
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

// passport.deserializeUser(async (id: string, done) => {
//   // Invoke API request to User Microservice to retrieve user
//   // Mocking user for now
//   try {
//     const userMock: User = await findUser(id);
//     done(null, userMock);
//   } catch (error) {
//     done(error, null);
//   }
// });

export default passport;
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "../../config/config";
const GoogleOauth2Config = config.GoogleOauth2Config;
import { verify, JwtPayload } from "jsonwebtoken";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IProfile {
  id: string;
  displayName: string;
  email: string;
  provider: string;
}

// Mock API Request to create or retrieve user from User Microservice
const getOrCreateUser = async (profile: IProfile) => {
  const user: User = await new Promise((resolve) => {
    setTimeout(() => {
      if (profile.id === "114209728723577334382") {
        resolve({
          id: "1",
          name: profile.displayName,
          email: profile.email,
          role: "admin",
        });
      } else {
        resolve({
          id: "2",
          name: profile.displayName,
          email: profile.email,
          role: "superadmin",
        });
      }
    }, 1000);
  });
  return user;
};
// Mock API Request to find user from User Microservice
const findUser = async (id: string) => {
  const user: User = await new Promise((resolve, rejects) => {
    setTimeout(() => {
      if (id === "1") {
        resolve({
          id: "1",
          name: "Ng Shen Jie",
          email: "ngshenjie@gmail.com",
          role: "admin",
        });
      } else if (id === "2") {
        resolve({
          id: "2",
          name: "Ng Shen Jie",
          email: "ngshen.jie1999@gmail.com",
          role: "superadmin",
        });
      } else {
        rejects("User not found");
      }
    }, 1000);
  });
  return user;
};

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
        // Verify jwt payload is not expired
        // const now = Date.now() / 1000;
        // For testing purposes, add 1.5 hours from the timestamp
        console.log(jwtPayload);
        const now = Date.now() / 1000; //+ (60 * 60 * 1);
        console.log(jwtPayload.exp, now);
        if (jwtPayload.exp && jwtPayload.exp < now) {
          return done(new Error("Token expired"));
        }
        // Find user from User Microservice
        const user = await findUser(jwtPayload.id as string);
        if (!user) {
          return done(new Error("User not found"));
        }
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
      const user = await getOrCreateUser(userProfile);
      console.log(user);
      done(null, user);
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
  // Invoke API request to User Microservice to retrieve user
  // Mocking user for now
  try {
    const userMock: User = await findUser(id);
    done(null, userMock);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

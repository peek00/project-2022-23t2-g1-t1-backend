import dotenv from "dotenv";
dotenv.config();

export const config = {
  GoogleOauth2Config: {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true as true,
  },
  COOKIE_KEY: process.env.COOKIE_KEY as string,
  CloudWatchConfigPartial: {
    awsAccessKeyId: process.env.CLOUDWATCH_ACCESS_KEY,
    awsSecretKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
    awsRegion: process.env.CLOUDWATCH_REGION,
  },
  AdditionalInfo: {
    User: ["userId", "email", "role"],
    Points: ["userId", "previousBalance", "newBalance"],
    MakerChecker: ["userId", "action"],
  },
  RententionPolicy: {
    User: 30, // 30 days
    Points: 30,
    MakerChecker: 30,
  },
};

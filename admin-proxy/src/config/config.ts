import dotenv from "dotenv";
dotenv.config();

export const config = {
  GoogleOauth2Config: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "/auth/google/callback",
    passReqToCallback: true as true,
  },
  CloudWatchConfigPartial: {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    awsRegion: process.env.CLOUDWATCH_REGION || '',
  },
  AdditionalInfo: {
    User: ["email", "role"],
    Points: ["previousBalance", "newBalance"],
    MakerChecker: ["action"],
  },
  RententionPolicy: {
    User: 30, // 30 days
    Points: 30,
    MakerChecker: 30,
  },
  AWSConfig: {
    region: process.env.AWS_DEFAULT_REGION || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
};

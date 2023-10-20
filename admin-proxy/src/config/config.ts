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
    MakerChecker: ["action","finalUser"],
  },
  RententionPolicy: {
    User: 30, // 30 days
    Points: 30,
    MakerChecker: 30,
  },
  AWSConfig: {
    region: process.env.AWS_DEFAULT_REGION || 'local',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    dynamoDBEndpoint: process.env.AWS_DYNAMODB_ENDPOINT || undefined,
  },
  ProxyPaths: {
    userProxy: process.env.USER_MS || '',
    pointsProxy: process.env.POINTS_MS || '',
    makerCheckerProxy: process.env.MAKER_CHECKER_MS || '',
  },
};

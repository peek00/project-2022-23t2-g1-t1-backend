const dotenv = require("dotenv")
dotenv.config();

const config = {
// module.exports = {
    aws_table_name: 'new-points-ledger',
    aws_local_config: {
      //Provide details for local configuration
        region: process.env.AWS_DEFAULT_REGION || 'local',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
        // dynamoDBEndpoint: "http://localhost:8000",
        // dynamoDBEndpoint: "http://docker.for.mac.localhost:8000",
        dynamoDBEndpoint: process.env.AWS_DYNAMODB_ENDPOINT || "http://host.docker.internal:8000",
    },
    aws_remote_config: {
      accessKeyId: 'ACCESS_KEY_ID',
      secretAccessKey: 'SECRET_ACCESS_KEY',
      region: 'us-east-1',
      dynamoDBEndpoint: undefined
    }
};

module.exports = config;
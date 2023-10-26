module.exports = {
    aws_table_name: 'points_ledger',
    aws_local_config: {
      //Provide details for local configuration
        region: process.env.AWS_REGION,
        accessKeyId: 'test',
        secretAccessKey: 'test',
        // dynamoDBEndpoint: "http://localhost:8000",
        // dynamoDBEndpoint: "http://docker.for.mac.localhost:8000",
        dynamoDBEndpoint: process.env.AWS_DYNAMODB_ENDPOINT
    },
    aws_remote_config: {
      accessKeyId: 'ACCESS_KEY_ID',
      secretAccessKey: 'SECRET_ACCESS_KEY',
      region: 'us-east-1',
      dynamoDBEndpoint: undefined
    }
};
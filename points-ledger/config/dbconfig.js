// Create a connection to dynamodb
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");


const createDynamoDBClient = () => {
//   console.log(`{ 
//     region: ${process.env.AWS_REGION || "local"},
//     endpoint: ${process.env.AWS_DYNAMODB_ENDPOINT || "http://host.docker.internal:8000"},
//     credentials: {
//       accessKeyId: ${process.env.AWS_ACCESS_KEY_ID || "test"},
//       secretAccessKey: ${process.env.AWS_SECRET_ACCESS || "test"},
//     }`);
  let client;
  if (process.env.NODE_ENV === "production") {
    client = new DynamoDBClient({ 
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
      },
    });
  } else {
    client = new DynamoDBClient({ 
      region: process.env.AWS_REGION || "local",
      endpoint: process.env.AWS_DYNAMODB_ENDPOINT || "http://host.docker.internal:8000",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
      },
    });
  }

  const db = DynamoDBDocumentClient.from(client);
  return db;
}

module.exports = createDynamoDBClient;
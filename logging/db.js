// Create a connection to dynamodb
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";


export const createDynamoDBClient = () => {
  console.log(`{ 
    region: ${process.env.AWS_REGION || "local"},
    endpoint: ${process.env.AWS_DYNAMODB_ENDPOINT || undefined},
    credentials: {
      accessKeyId: ${process.env.AWS_ACCESS_KEY_ID || "test"},
      secretAccessKey: ${process.env.AWS_SECRET_ACCESS || "test"},
    }`);

  const client = new DynamoDBClient({ 
    region: process.env.AWS_REGION || "local",
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "testY",
      secretAccessKey: process.env.AWS_SECRET_ACCESS || "test",
    },
  });

  const db = DynamoDBDocumentClient.from(client);
  return db;
}

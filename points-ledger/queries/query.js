// import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const config = require("../config/config.js")
const { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const AWSConfig = config.aws_local_config;
const ddbClient = new DynamoDBClient({ 
    region: AWSConfig.region,
    endpoint: AWSConfig.dynamoDBEndpoint,
    credentials: {
        accessKeyId: AWSConfig.accessKeyId,
        secretAccessKey: AWSConfig.secretAccessKey
    }
});
// const ddbClient = new DynamoDBClient({ region : config.aws_local_config.region })
// const ddbClient = new DynamoDBClient({ region : 'local' })


// AWS.config.update({
//     region: "local",
//     endpoint: "http://localhost:8000"
//   });

// get all points balance for the particular userid
async function getAllAccounts(userId) {
    try {
        // console.log(AWS.config);
        const result = [];
        const input = {
            "ExpressionAttributeValues": marshall({
                ":v1":userId
            }),
            "IndexName": "user_id",
            "KeyConditionExpression": "user_id = :v1",
            // need change table name
            "TableName": config.aws_table_name
            // "TableName": "points_ledger"
        };
        const data = await ddbClient.send(new QueryCommand(input));
        const items = data.Items;
        //   console.log(items);
        for (let item of items){
            let cleaneddata = unmarshall(item);
            result.push(cleaneddata);
        }
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// returns all details of particular account
async function getPointsBalance(pointsId) {
    try{
        const params = {
            // TableName: 'points_ledger',
            "TableName": config.aws_table_name,
            Key: marshall( 
                {id: pointsId }
                // , { removeUndefinedValues: true } 
                ) 
        }
        const data = await ddbClient.send(new GetItemCommand(params));
        // const item = unmarshall(data.Item);
        // const item = data.Item;
        // return item;
        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

// check if points acc exist
async function pointsAccExist(pointsid) {
    try{
        const params = {
            // TableName: 'points_ledger',
            "TableName": config.aws_table_name,
            Key: marshall( 
                {id: pointsid }
                // , { removeUndefinedValues: true } 
            ) 
        }
        const data = await ddbClient.send(new GetItemCommand(params));
        if (data.Item){
            return true;
        }
        else{
            return false;
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

// create points account
async function createAccount(userId, new_pointsId,inputbalance) {
    // const new_pointsId = uuidv4();
    // console.log(new_pointsId);
    try {
        const params = {
            "Item": {
                "id": { "S" : new_pointsId},
                "user_id": {"S" : userId },
                "balance": {"N" : inputbalance }
            },
            "TableName": config.aws_table_name,
            "ReturnConsumedCapacity":"TOTAL",
        }

        const data = await ddbClient.send(new PutItemCommand(params));
        return data
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


// update points from particular points account
async function updatePoints(pointsId,newbalance) {
    try {
        const params = {
            "ExpressionAttributeValues" : marshall({
                ":v1": newbalance
            }),
            "Key": marshall({
                "id": pointsId
            }),
            // "TableName": "points_ledger",
            "TableName": config.aws_table_name,
            "UpdateExpression": "SET balance = :v1"
        }
        const data = await ddbClient.send(new UpdateItemCommand(params));
        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

// delete points_balance account
async function deleteAccount(pointsId){
    try {
        const params = {
            "TableName": config.aws_table_name,
            "Key": marshall(
                {id: pointsId}
            )
        }
        const data = await ddbClient.send(new DeleteItemCommand(params))
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPointsBalance, getAllAccounts, pointsAccExist, updatePoints, createAccount, deleteAccount };
// import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const config = require("../config/config.js")
const { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const local_config = config.aws_local_config;
const ddbClient = new DynamoDBClient({ local_config });
// const ddbClient = new DynamoDBClient({ region : config.aws_local_config.region })
// const ddbClient = new DynamoDBClient({ region : 'local' })


// AWS.config.update({
//     region: "local",
//     endpoint: "http://localhost:8000"
//   });

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

module.exports = { getPointsBalance, getAllAccounts, pointsAccExist, updatePoints };
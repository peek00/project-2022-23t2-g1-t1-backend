// import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const {Redis} = require("../modules/CacheProvider/Redis");
const config = require("../config/config.js");
const { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const AWSConfig = config.aws_local_config;
const CacheProvider = Redis.getInstance();
const ddbClient = new DynamoDBClient({ 
    region: AWSConfig.region,
    endpoint: AWSConfig.dynamoDBEndpoint,
    credentials: {
        accessKeyId: AWSConfig.accessKeyId,
        secretAccessKey: AWSConfig.secretAccessKey
    }
});

// get all points balance for the particular userid
async function getAllAccounts(userId) {
    try {
        const redisKey = `accounts:${userId}`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");
        if (cachedData) {
            console.log("Cache hit");
            return JSON.parse(cachedData);
        }

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

        for (let item of items){
            let cleaneddata = unmarshall(item);
            result.push(cleaneddata);
        }
        // Cache result in Redis for 10min
        await CacheProvider.write(redisKey, JSON.stringify(result),600);
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
        const redisKey = `pointsBalance:${pointsId}`;
        const cachedData = await CacheProvider.get(redisKey);
        if (cachedData) {
            console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        // if no cached data, query dynanamodb
        const params = {
            "TableName": config.aws_table_name,
            Key: marshall( 
                {id: pointsId }
                ) 
        }
        const data = await ddbClient.send(new GetItemCommand(params));
        
        // cache result in Redis for 10min
        await CacheProvider.write(redisKey, JSON.stringify(data,600));
        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

// check if points acc exist
async function pointsAccExist(pointsId) {
    try{
        const redisKey = `pointsBalance:${pointsId}`;
        const cachedData = await CacheProvider.get(redisKey);
        if (cachedData !== null) {
            console.log("Cache hit");
            return cachedData === 'true';
        }
        const params = {
            "TableName": config.aws_table_name,
            Key: marshall( 
                {id: pointsId }
            ) 
        }
        const data = await ddbClient.send(new GetItemCommand(params));
        const exists = false;
        if (data.Item){
            exists = true;
        }
        await CacheProvider.write(redisKey, exists.toString(),600);
        
        return exists;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

// create points account
async function createAccount(userId, new_pointsId,inputbalance) {
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
        const redisKeyAccounts = `accounts:${userId}`;
        await CacheProvider.remove(redisKeyAccounts);
        console.log(`Created Points Account ${new_pointsId}`);
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
            "TableName": config.aws_table_name,
            "UpdateExpression": "SET balance = :v1"
        }
        const data = await ddbClient.send(new UpdateItemCommand(params));

        // invalidate cache for this pointsId
        const redisKey = `pointsBalance:${pointsId}`;
        await CacheProvider.remove(redisKey);

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

        // invalidate cache for this pointsId
        const redisKey = `pointsBalance:${pointsId}`;
        await CacheProvider.remove(redisKey);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPointsBalance, getAllAccounts, pointsAccExist, updatePoints, createAccount, deleteAccount };
// import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const {Redis} = require("../modules/CacheProvider/Redis");
const config = require("../config/config.js");
const { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const CacheProvider = Redis.getInstance();
let ddbClient;
if (process.env.NODE_ENV === "production") {
    ddbClient = new DynamoDBClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
} else {
    ddbClient = new DynamoDBClient({
        region: process.env.AWS_REGION || "local",
        endpoint: process.env.AWS_DYNAMODB_ENDPOINT || "http://host.docker.internal:8000",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test"
        }
    });
}



async function getAllAccounts(userId, companyId) {
    try {
        const redisKey = `account:${companyId}:${userId}`;
        //console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        //console.log("called cache");
        
        if (cachedData) {
            //console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        const input = {
            "ExpressionAttributeValues": marshall({
                ":companyVal": companyId,
                ":userVal": userId
            }, {
                removeUndefinedValues: true
            }),
            // "IndexName": "user_id",
            "KeyConditionExpression": "company_id = :companyVal AND user_id = :userVal",
            "TableName": config.aws_table_name
        };
        
        const data = await ddbClient.send(new QueryCommand(input));
        const items = data.Items;


        const result = items.map(item => unmarshall(item));
        // const result = [];
        // for (let item of items) {
        //     let cleaneddata = unmarshall(item);
        //     result.push(cleaneddata);
        // }
        // Cache result in Redis for 10min
        await CacheProvider.write(redisKey, JSON.stringify(result), 300);
        //console.log(result);

        return result.length > 0 ? result : null;

        // if (result.length > 0) {
        //     return result;
        // } else {
        //     return null;
        // }

    } catch (err) {
        //console.log("Error retrieving accounts:", err);
        throw err;
    }
}

// returns all user_ids when given companyid
async function getAllUserIdsByCompanyId(companyId) {
    try {
        const redisKey = `userIdsByCompanyId:${companyId}`;
        //console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        //console.log("called cache");

        if (cachedData) {
            //console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        const input = {
            "ExpressionAttributeValues": marshall({
                ":companyVal": companyId
            }, {
                removeUndefinedValues: true
            }),
            "KeyConditionExpression": "company_id = :companyVal",
            "TableName": config.aws_table_name
        };

        const data = await ddbClient.send(new QueryCommand(input));
        const items = data.Items;

        // Extract user_ids from the items
        const userIds = items.map(item => unmarshall(item).user_id);

        // Cache result in Redis for 10min
        await CacheProvider.write(redisKey, JSON.stringify(userIds), 300);
        //console.log(userIds);

        return userIds.length > 0 ? userIds : [];

    } catch (err) {
        //console.log(err);
        throw err;
    }
}


async function getAllIdsByCompanyId(companyId) {
    try {
        const redisKey = `idsByCompanyId:${companyId}`;
        //console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        //console.log("called cache");

        if (cachedData) {
            //console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        const input = {
            "ExpressionAttributeValues": marshall({
                ":companyVal": companyId
            }, {
                removeUndefinedValues: true
            }),
            "KeyConditionExpression": "company_id = :companyVal",
            "TableName": config.aws_table_name,
            // "ProjectionExpression": "id" 
        };

        const data = await ddbClient.send(new QueryCommand(input));
        const items = data.Items;

        // const ids = items.map(item => unmarshall(item).id);
        const result = items.map(item => unmarshall(item));
        // Cache result in Redis for 5min (300 seconds)
        await CacheProvider.write(redisKey, JSON.stringify(result), 300);
        // //console.log(ids);

        return result.length > 0 ? result : [];

    } catch (err) {
        //console.log(err);
        throw err;
    }
}


async function getAllAccountsByUserId(userId) {
    try {
        const redisKey = `accountsByUserId:${userId}`;
        //console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        //console.log("called cache");

        if (cachedData) {
            //console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        const input = {
            "ExpressionAttributeValues": marshall({
                ":userVal": userId
            }, {
                removeUndefinedValues: true
            }),
            "IndexName": "get_all_accounts", // Use the new global secondary index
            "KeyConditionExpression": "user_id = :userVal",
            "TableName": config.aws_table_name
        };

        const data = await ddbClient.send(new QueryCommand(input));
        const items = data.Items;

        const result = items.map(item => unmarshall(item));

        // Cache result in Redis for 10min
        // await CacheProvider.write(redisKey, JSON.stringify(result), 300);
        //console.log(result);

        return result.length > 0 ? result : [];

    } catch (err) {
        //console.log(err);
        throw err;
    }
}


async function getPointsBalance(companyId, pointsId) {
    try{
        const redisKey = `pointsBalance:${companyId}:${pointsId}`;
        const cachedData = await CacheProvider.get(redisKey);
        if (cachedData) {
            //console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        // if no cached data, query DynamoDB
        const params = {
            TableName: config.aws_table_name,
            IndexName: "points_id",
            KeyConditionExpression: "company_id = :companyId AND id = :pointsId",
            ExpressionAttributeValues: marshall({
                ":companyId": companyId,
                ":pointsId": pointsId
            }),
            Limit: 1 
        };

        const data = await ddbClient.send(new QueryCommand(params));
        
        if (data.Items.length === 0) {
            //console.log("Item not found");
            return null;  // or handle this scenario as you deem appropriate
        }
        
        const result = unmarshall(data.Items[0]);
        
        // cache result in Redis for 10min
        await CacheProvider.write(redisKey, JSON.stringify(result), 300);
        
        return result;
    }
    catch (err) {
        //console.log("Error retrieving points balance:", err);
        throw err;
    }
}


async function pointsAccExist(companyId, pointsId) {
    try{
        const params = {
            TableName: config.aws_table_name,
            IndexName: "points_id",
            KeyConditionExpression: "company_id = :companyId AND id = :pointsId",
            ExpressionAttributeValues: marshall({
                ":companyId": companyId,
                ":pointsId": pointsId
            }),
            Limit: 1 
        };

        const data = await ddbClient.send(new QueryCommand(params));
        
        //console.log(data);
        let exists = false;
        if (data.Items.length != 0){
            exists = true;
        }
        
        return exists;
    }
    catch (err) {
        //console.log(err);
        throw err;
    }
}

async function userAccExist(companyId, userId) {
    try{
        const params = {
            TableName: config.aws_table_name,
            KeyConditionExpression: "company_id = :companyId AND user_id = :userId",
            ExpressionAttributeValues: marshall({
                ":companyId": companyId,
                ":userId": userId
            }),
            Limit: 1 
        };

        const data = await ddbClient.send(new QueryCommand(params));
        
        //console.log(data);
        const exists = data.Items.length > 0;
        
        return exists;
    }
    catch (err) {
        //console.log(err);
        throw err;
    }
}

async function getAllCompanyIds() {
    try {
        const redisKey = `allCompanyIds`;
        //console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        //console.log("called cache");

        if (cachedData) {
            //console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        // As there is no direct way to get all the unique 'company_id' attributes,
        const input = {
            "TableName": config.aws_table_name,
            "ProjectionExpression": "company_id" // Only fetch the 'company_id' attribute
        };

        const data = await ddbClient.send(new ScanCommand(input));
        const items = data.Items;

        // Extract the unique 'company_id' values from the items
        const allCompanyIds = [...new Set(items.map(item => unmarshall(item).company_id))];

        // Cache result in Redis for 10min
        await CacheProvider.write(redisKey, JSON.stringify(allCompanyIds), 6000000);
        //console.log(allCompanyIds);

        return allCompanyIds.length > 0 ? allCompanyIds : [];

    } catch (err) {
        //console.log(err);
        throw err;
    }
}


async function companyExists(companyId) {
    try {

        const params = {
            "TableName": config.aws_table_name,
            "KeyConditionExpression": "company_id = :companyId",
            "ExpressionAttributeValues": marshall({
                ":companyId": companyId
            }),
            "Limit": 1 
        };

        const data = await ddbClient.send(new QueryCommand(params));

        const exists = data.Count > 0;
        
        return exists;
    }
    catch (err) {
        //console.log(err);
        throw err;
    }
}

async function createAccount(companyId, userId, new_pointsId, inputbalance) {
    try {
        const params = {
            "Item": {
                "company_id": { "S" : companyId },
                "id": { "S" : new_pointsId},
                "user_id": {"S" : userId },
                "balance": {"N" : inputbalance }
            },
            "TableName": config.aws_table_name,
            "ConditionExpression": "attribute_not_exists(company_id) AND attribute_not_exists(user_id)",
            "ReturnConsumedCapacity":"TOTAL",
        }

        const data = await ddbClient.send(new PutItemCommand(params));
        
        // Invalidating cached data for this user (as their data might have changed with this new record)
        const redisKeyAccounts = `accounts:${userId}`;
        const redisKey = `accountsByUserId:${userId}`;
        const otherredisKey = `account:${companyId}:${userId}`
        await CacheProvider.remove(redisKeyAccounts);
        await CacheProvider.remove(redisKey);
        await CacheProvider.remove(otherredisKey);
        await CacheProvider.remove(`pointsBalance:${companyId}:${userId}`)
        await CacheProvider.remove(`idsByCompanyId:${companyId}`)
        await CacheProvider.remove(`userIdsByCompanyId:${companyId}`)

        //console.log(`Created Points Account ${new_pointsId} for Company ${companyId}`);
        return data;
    }
    catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            //console.log(`Account with user_id ${userId} already exists for company_id ${companyId}.`);
        } else {
            console.error(err);
        }
        throw err;
    }
}


async function updatePoints(companyId, userId, newbalance) {
    try {
        const params = {
            "ExpressionAttributeValues": marshall({
                ":v1": newbalance
            }),
            "Key": marshall({
                "company_id": companyId,
                "user_id": userId
            }),
            "TableName": config.aws_table_name,
            "UpdateExpression": "SET balance = :v1"
        }

        const data = await ddbClient.send(new UpdateItemCommand(params));

        // Invalidate cache for this pointsId and companyId combination
        const redisKey = `pointsBalance:${companyId}:${userId}`;
        const redisKeyAccounts = `accounts:${userId}`;
        const newredisKey = `accountsByUserId:${userId}`;
        const otherredisKey = `account:${companyId}:${userId}`
        await CacheProvider.remove(redisKeyAccounts);
        await CacheProvider.remove(redisKey);
        await CacheProvider.remove(otherredisKey);
        await CacheProvider.remove(newredisKey);
        await CacheProvider.remove(`idsByCompanyId:${companyId}`);
        await CacheProvider.remove(`userIdsByCompanyId:${companyId}`)

        return data;
    }
    catch (err) {
        //console.log("Error updating points: ", err);
        throw err;
    }
}


async function deleteAccount(companyId, userId) {
    try {
        const params = {
            TableName: config.aws_table_name,
            Key: marshall({
                company_id: companyId,
                user_id: userId  
            })
        }

        const data = await ddbClient.send(new DeleteItemCommand(params));

        // Invalidate cache for this userId and companyId combination
        const redisKey = `pointsBalance:${companyId}:${userId}`;
        const redisKeyAccounts = `accounts:${userId}`;
        const newredisKey = `accountsByUserId:${userId}`;
        const otherredisKey = `account:${companyId}:${userId}`
        await CacheProvider.remove(redisKeyAccounts);
        await CacheProvider.remove(redisKey);
        await CacheProvider.remove(otherredisKey);
        await CacheProvider.remove(newredisKey);
        await CacheProvider.remove(`idsByCompanyId:${companyId}`);
        await CacheProvider.remove(`userIdsByCompanyId:${companyId}`)
        return data;
    }
    catch (err) {
        console.error("Error deleting account:", err);
        throw err;
    }
}

async function modifyPoints(companyId, userId, change) {
    try {
        // find old results to know the old points balance
        const input = {
            "ExpressionAttributeValues": marshall({
                ":companyVal": companyId,
                ":userVal": userId
            }, {
                removeUndefinedValues: true
            }),
            // "IndexName": "user_id",
            "KeyConditionExpression": "company_id = :companyVal AND user_id = :userVal",
            "TableName": config.aws_table_name
        };
        
        const oldResult = await ddbClient.send(new QueryCommand(input));
        const items = oldResult.Items;
        const result = items.map(item => unmarshall(item));
        const searchResultBalance = result[0]["balance"];

        // update to the newbalance
        const newbalance = parseInt(searchResultBalance) + parseInt(change);

        const params = {
            "ExpressionAttributeValues": marshall({
                ":v1": newbalance
            }),
            "Key": marshall({
                "company_id": companyId,
                "user_id": userId
            }),
            "TableName": config.aws_table_name,
            "UpdateExpression": "SET balance = :v1"
        }

        const data = await ddbClient.send(new UpdateItemCommand(params));

        // Invalidate cache for this pointsId and companyId combination
        const redisKey = `pointsBalance:${companyId}:${userId}`;
        const redisKeyAccounts = `accounts:${userId}`;
        const newredisKey = `accountsByUserId:${userId}`;
        const otherredisKey = `account:${companyId}:${userId}`
        await CacheProvider.remove(redisKeyAccounts);
        await CacheProvider.remove(redisKey);
        await CacheProvider.remove(otherredisKey);
        await CacheProvider.remove(newredisKey);
        await CacheProvider.remove(`idsByCompanyId:${companyId}`);
        await CacheProvider.remove(`userIdsByCompanyId:${companyId}`)

        return data;
    }
    catch (err) {
        //console.log("Error updating points: ", err);
        throw err;
    }
}

module.exports = { getPointsBalance, getAllAccounts, pointsAccExist, userAccExist, updatePoints, modifyPoints, createAccount, deleteAccount, getAllAccountsByUserId, companyExists, getAllUserIdsByCompanyId, getAllCompanyIds, getAllIdsByCompanyId};
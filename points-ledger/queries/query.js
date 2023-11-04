// import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const {Redis} = require("../modules/CacheProvider/Redis");
const config = require("../config/config.js");
const { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
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



async function getAllAccounts(userId, companyId) {
    try {
        const redisKey = `account:${companyId}:${userId}`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");
        
        if (cachedData) {
            console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        const input = {
            "ExpressionAttributeValues": marshall({
                ":companyVal": companyId,
                ":userVal": userId
            }, {
                removeUndefinedValues: true
            }),
            "IndexName": "user_id",
            "KeyConditionExpression": "company_id = :companyVal AND user_id = :userVal",
            "TableName": config.aws_table_name
        };
        
        const data = await ddbClient.send(new QueryCommand(input));
        const items = data.Items;

        const result = [];
        for (let item of items) {
            let cleaneddata = unmarshall(item);
            result.push(cleaneddata);
        }
        // Cache result in Redis for 10min
        await CacheProvider.write(redisKey, JSON.stringify(result), 300);
        console.log(result);

        if (result.length > 0) {
            return result;
        } else {
            return null;
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getAllAccountsByUserId(userId) {
    try {
        const redisKey = `accountsByUserId:${userId}`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");

        if (cachedData) {
            console.log("Cache hit");
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
        await CacheProvider.write(redisKey, JSON.stringify(result), 300);
        console.log(result);

        return result.length > 0 ? result : null;

    } catch (err) {
        console.log(err);
        throw err;
    }
}


// returns all user_ids when given companyid
async function getAllUserIdsByCompanyId(companyId) {
    try {
        const redisKey = `userIdsByCompanyId:${companyId}`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");

        if (cachedData) {
            console.log("Cache hit");
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
        console.log(userIds);

        return userIds.length > 0 ? userIds : [];

    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function getAllIdsByCompanyId(companyId) {
    try {
        const redisKey = `idsByCompanyId:${companyId}`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");

        if (cachedData) {
            console.log("Cache hit");
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
            "ProjectionExpression": "id" 
        };

        const data = await ddbClient.send(new QueryCommand(input));
        const items = data.Items;

        const ids = items.map(item => unmarshall(item).id);

        // Cache result in Redis for 5min (300 seconds)
        await CacheProvider.write(redisKey, JSON.stringify(ids), 300);
        console.log(ids);

        return ids.length > 0 ? ids : [];

    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function getAllAccountsByUserId(userId) {
    try {
        const redisKey = `accountsByUserId:${userId}`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");

        if (cachedData) {
            console.log("Cache hit");
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
        await CacheProvider.write(redisKey, JSON.stringify(result), 300);
        console.log(result);

        return result.length > 0 ? result : null;

    } catch (err) {
        console.log(err);
        throw err;
    }
}

// returns all points accounts by given company_id


// returns all user_ids when given companyid
async function getAllUserIdsByCompanyId(companyId) {
    try {
        const redisKey = `userIdsByCompanyId:${companyId}`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");

        if (cachedData) {
            console.log("Cache hit");
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
        console.log(userIds);

        return userIds.length > 0 ? userIds : [];

    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function getPointsBalance(companyId, pointsId) {
    try{
        const redisKey = `pointsBalance:${companyId}:${pointsId}`;
        const cachedData = await CacheProvider.get(redisKey);
        if (cachedData) {
            console.log("Cache hit");
            return JSON.parse(cachedData);
        }

        // if no cached data, query DynamoDB
        const params = {
            "TableName": config.aws_table_name,
            Key: marshall({
                company_id: companyId,
                id: pointsId 
            }) 
        };
        
        const data = await ddbClient.send(new GetItemCommand(params));
        
        // Check if item exists in the DynamoDB response
        if (!data.Item) {
            console.log("Item not found");
            return null;  // or handle this scenario as you deem appropriate
        }
        
        const result = unmarshall(data.Item);
        
        // cache result in Redis for 10min
        await CacheProvider.write(redisKey, JSON.stringify(result), 300);
        
        return result;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


async function pointsAccExist(companyId, pointsId) {
    try{
        const redisKey = `pointsExistence:${companyId}:${pointsId}`;
        const cachedData = await CacheProvider.get(redisKey);
        
        if (cachedData !== null) {
            console.log("Cache hit");
            return cachedData === 'true';
        }

        const params = {
            "TableName": config.aws_table_name,
            Key: marshall({
                company_id: companyId,
                id: pointsId 
            }) 
        };
        
        const data = await ddbClient.send(new GetItemCommand(params));
        
        let exists = false;
        if (data.Item){
            exists = true;
        }

        // Cache the existence result in Redis for 10min
        await CacheProvider.write(redisKey, exists.toString(), 300);
        
        return exists;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

async function getAllCompanyIds() {
    try {
        const redisKey = `allCompanyIds`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");

        if (cachedData) {
            console.log("Cache hit");
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
        await CacheProvider.write(redisKey, JSON.stringify(allCompanyIds), 600);
        console.log(allCompanyIds);

        return allCompanyIds.length > 0 ? allCompanyIds : [];

    } catch (err) {
        console.log(err);
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
            "Limit": 1 // We only need to know if at least one exists
        };

        const data = await ddbClient.send(new QueryCommand(params));

        const exists = data.Count > 0;
        
        return exists;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

async function getAllCompanyIds() {
    try {
        const redisKey = `allCompanyIds`;
        console.log("Calling cache");
        const cachedData = await CacheProvider.get(redisKey);
        console.log("called cache");

        if (cachedData) {
            console.log("Cache hit");
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
        await CacheProvider.write(redisKey, JSON.stringify(allCompanyIds), 600);
        console.log(allCompanyIds);

        return allCompanyIds.length > 0 ? allCompanyIds : [];

    } catch (err) {
        console.log(err);
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
            "Limit": 1 // We only need to know if at least one exists
        };

        const data = await ddbClient.send(new QueryCommand(params));

        const exists = data.Count > 0;
        
        return exists;
    }
    catch (err) {
        console.log(err);
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
            "ReturnConsumedCapacity":"TOTAL",
        }

        const data = await ddbClient.send(new PutItemCommand(params));
        
        // Invalidating cached data for this user (as their data might have changed with this new record)
        const redisKeyAccounts = `accounts:${userId}`;
        await CacheProvider.remove(redisKeyAccounts);

        console.log(`Created Points Account ${new_pointsId} for Company ${companyId}`);
        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


async function updatePoints(companyId, pointsId, newbalance) {
    try {
        const params = {
            "ExpressionAttributeValues": marshall({
                ":v1": newbalance
            }),
            "Key": marshall({
                "company_id": companyId,
                "id": pointsId
            }),
            "TableName": config.aws_table_name,
            "UpdateExpression": "SET balance = :v1"
        }

        const data = await ddbClient.send(new UpdateItemCommand(params));

        // Invalidate cache for this pointsId and companyId combination
        const redisKey = `pointsBalance:${companyId}:${pointsId}`;
        await CacheProvider.remove(redisKey);

        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


async function deleteAccount(companyId, pointsId) {
    try {
        const params = {
            "TableName": config.aws_table_name,
            "Key": marshall({
                "company_id": companyId,
                "id": pointsId
            })
        }

        const data = await ddbClient.send(new DeleteItemCommand(params));

        // Invalidate cache for this pointsId and companyId combination
        const redisKey = `pointsBalance:${companyId}:${pointsId}`;
        await CacheProvider.remove(redisKey);
        
        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = { getPointsBalance, getAllAccounts, pointsAccExist, updatePoints, createAccount, deleteAccount, getAllAccountsByUserId, companyExists, getAllUserIdsByCompanyId, getAllCompanyIds};
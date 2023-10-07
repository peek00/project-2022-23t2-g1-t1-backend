// import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const { DynamoDBClient, GetItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const ddbClient = new DynamoDBClient({ region : 'local' })

// AWS.config.update({
//     region: "local",
//     endpoint: "http://localhost:8000"
//   });

async function getAllAccounts(userId) {
    try {
        const result = [];
        const input = {
            "ExpressionAttributeValues": marshall({
                ":v1":userId
            }),
            "IndexName": "user_id",
            "KeyConditionExpression": "user_id = :v1",
            // need change table name
            "TableName": "points_ledger"
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

async function getPointsBalance(pointsId) {
    try{
        const params = {
            TableName: 'points_ledger',
            Key: marshall( 
                {id: pointsId }
                // , { removeUndefinedValues: true } 
                ) 
        }
        const data = await ddbClient.send(new GetItemCommand(params));
        const item = unmarshall(data.Item);

        return item;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPointsBalance, getAllAccounts };
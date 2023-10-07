// import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const ddbClient = new DynamoDBClient({ region : 'local' })

// AWS.config.update({
//     region: "local",
//     endpoint: "http://localhost:8000"
//   });

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

module.exports = { getPointsBalance };
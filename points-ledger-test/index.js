import { DynamoDBClient, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const ddbClient = new DynamoDBClient({ region : 'local' })

// AWS.config.update({
//     region: "local",
//     endpoint: "http://localhost:8000"
//   });

const getPointsBalance = async (pointsid) => {
    const params = {
        TableName: 'points_ledger',
        Key: marshall( {id: pointsid } ) 
    }
    try {
        const data = await ddbClient.send(new GetItemCommand(params));
        console.log(unmarshall(data.Item));
    }
    catch (err) {
        console.log(err);
    }
}

const getAllAccounts = async (userId) => {
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
}

// const mainid = '2f5687c7-af51-4d79-9a38-9eef5a3c42b8'
// getPointsBalance(mainid);

const userId = "d89eb1a2-ade2-4004-9528-9ccee344e3b9";
getAllAccounts(userId);
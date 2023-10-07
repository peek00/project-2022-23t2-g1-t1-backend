import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
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
const mainid = '2f5687c7-af51-4d79-9a38-9eef5a3c42b8'
getPointsBalance(mainid);
import { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
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

const pointsAccExist = async(pointsid) => {
    const params = {
        TableName: 'points_ledger',
        Key: marshall( {id: pointsid } ) 
    }
    try {
        const data = await ddbClient.send(new GetItemCommand(params));
        // return data;
        if (data.Item) {
            console.log('true');
        }
        else {
            console.log('false');
        }
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

const updatePoints = async(pointsId,newbalance) => {
    const input = {
        "ExpressionAttributeValues" : marshall({
            ":v1": newbalance
        }),
        "Key": marshall({
            "id": pointsId
        }),
        "ReturnValues": "ALL_NEW",
        "TableName": "points_ledger",
        "UpdateExpression": "SET balance = :v1"
    };
    if (!pointsAccExist(pointsId)){
        console.log("don't exist");
    }
    else{
        console.log("exist");
    }
    try{
        const data = await ddbClient.send(new UpdateItemCommand(input));
        console.log(data);
    }
    catch(err) {
        console.log(err);
    }
    
}
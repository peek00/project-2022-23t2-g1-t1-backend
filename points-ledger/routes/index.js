var express = require('express');
var router = express.Router();
const allquery = require('../queries/query');
const {unmarshall} = require("@aws-sdk/util-dynamodb");
const { v4:uuidv4} = require('uuid');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); 
});


// GET request to return all accounts by a particular user
// takes in a particular user_id
router.get('/allaccounts', async(req,res) => {
  console.log(req.headers);
  const userId = req.headers.userid;
  // console.log(req.body);
  // const userId = req.body.userId;
  allquery.getAllAccounts(userId)
  .then((results) => {
    console.log("Results: ", results);
    if (results.length==0) {
      res.status(400).json({
        "code" : 400,
        "logs_info": userId + " accessed all /allaccounts, status: 400",
        "data": results,
        "message": "No records found."
      })
    }
    res.status(200).json({
      "code" : 200,
      "logs_info": userId + " accessed '/allaccounts', status: 200",
      "data": results,
      "message": "Success"
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "logs_info": userId + " accessed '/allaccounts', status: 500",
      "data": [],
      "message": error.message
    });
  })
})

// GET request to return details of a particular account
// takes in a particular points account's id
router.get('/accdetails', async (req,res) => {
  console.log(req.headers);
  const pointsId = req.headers.pointsid;
  // console.log(req.body);
  // const pointsId = req.body.pointsId;
  /* The code is making a GET request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.getPointsBalance(pointsId)
  .then((results) => {
    console.log("Results: ", results);
    if (!results.Item){
      res.status(400).json({
        "code" : 400,
        "data": results,
        "message": "No record of points account found."
      })
    }
    const returnres = unmarshall(results.Item);
    res.status(200).json({
      "code" : 200,
      "logs_info": "Accessed '/accdetails' for points account {pointsId}, status: 200",
      "data" : returnres,
      "message" : "Success"
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
  // try {
  //   const params = {
  //     TableName: 'points_ledger',
  //     KeyConditionExpression: "id = :id",
  //     ExpressionAtttributeValues:{
  //       // ":id": req.query.id
  //       ":id": "2f5687c7-af51-4d79-9a38-9eef5a3c42b8"
  //     }
  //   }
  //   const result = await docClient.query(params).promise();
  //   console.log(result);
  //   res.status(200).json(result)
  // }
  // catch(error) {
  //   console.log(error);
  // }
})

// GET request to return if a particular account exists
// takes in a particular points account's id
router.get('/validate', async (req,res) => {
  console.log(req.headers);
  const mainId = req.headers.mainid;
  // console.log(req.body);
  // const mainId = req.body.mainId;
  /* The code is making a GET request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.pointsAccExist(mainId)
  .then((results) => {
    console.log(results);
    res.send(results);
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

// POST request to create a new points balance account
// takes in user_id and input balance 
router.post('/createAccount', async (req,res) => {
  console.log(req.headers);
  const userId = req.headers.userid;
  const inputbalance = req.headers.balance;
  // console.log(req.body);
  // const userId = req.body.userId;
  // const inputbalance = req.body.balance;
  const new_pointsId = uuidv4();
  console.log("uuid: " + new_pointsId)
  allquery.pointsAccExist(new_pointsId)
  .then((results) => {
    if (!results) {
      console.log("valid unique points_balance id");
      // if no such points_id balance
      allquery.createAccount(userId, new_pointsId, inputbalance)
      .then((newresults) => {
        const status = newresults.$metadata.httpStatusCode;
        if (status ==200) {
          res.status(200).json({
            "code": 200,
            "logs_info": "Accessed '/createAccount', new points account created, status: 200",
            "data": newresults,
            "message": "Account successfully created"
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          "code" : 500,
          "data" : [],
          "message" : err.message
        });
      })
    }
    //points acc id already exists
    else {
      res.status(400).json({
        "code" : 400,
        "data": [],
        "message" : 'Points Balance ID already exists'
      })
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

// POST request to delete a points balance account
// takes in pointsId
router.delete('/deleteAccount', function(req,res){
  console.log(req.headers);
  const pointsId = req.headers.pointsid;
  // console.log(req.body);
  // const pointsId = req.body.pointsId;
  allquery.pointsAccExist(pointsId)
  .then((ifexist) => {
    // if points account exist, then proceed with deleting
    if (ifexist) {
      allquery.deleteAccount(pointsId)
      .then((results) => {
        // const status = results.$metadata.httpStatusCode;
        // if (status==200){
          res.status(200).json({
            "code": 200,
            "logs_info": "Accessed '/deleteAccount', points account deleted, status: 200",
            "data": results,
            "message": "Account successfully deleted"
          })
        // }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          "code": 500,
          "logs_info": "Accessed '/deleteAccount', points account failed to delete, status: 500",
          "data": [],
          "message": err.message
        })
      })
    }
    else {
      res.status(400).json({
        "code": 400,
        "logs_info": "Accessed '/deleteAccount', no points account to delete, status: 400",
        "data": [],
        "message": "No such Points Account Exists"
      })
    }
  })
  
})

// PUT request to update balance of a particular account
// takes in a particular points account's id and new balance 
// sample input = {"mainId": "2f5687c7-af51-4d79-9a38-9eef5a3c42b8","newbalance": 5000}
router.put('/updatebalance', async (req,res) => {
  console.log(req.headers);
  const pointsId = req.headers.pointsid;
  const balance = req.headers.newbalance;
  // console.log(req.body);
  // const pointsId = req.body.pointsId;
  // const balance = req.body.newbalance;
  allquery.pointsAccExist(pointsId)
  .then((results) => {
    if (results){
      allquery.updatePoints(pointsId,balance)
      .then((newresults) => {
        const status = newresults.$metadata.httpStatusCode;
        if (status == 200) {
          res.status(200).json({
            "code" : 200,
            "logs_info": "Accessed '/updatebalance', points account balance updated, status: 200",
            "data" : newresults,
            "message" : "Update Success"
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          "code" : 500,
          "logs_info": "Accessed '/updatebalance', points account balance failed to update, status: 500",
          "data" : [],
          "message" : err.message
        });
      })
    }
    else {
      res.status(400).json({
        "code" : 400,
        "logs_info": "Accessed '/updatebalance', no such points account balance to update, status: 400",
        "data" : [],
        "message" : "No record of points account found."
      })
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

module.exports = router;
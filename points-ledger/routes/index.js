var express = require('express');
var router = express.Router();
const allquery = require('../queries/query');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); 
});


// GET request to return all accounts by a particular user
// takes in a particular user_id
router.get('/allaccounts', async(req,res) => {
  console.log(req.body);
  const userId = req.body.userId;
  allquery.getAllAccounts(userId)
  .then((results) => {
    console.log("Results: ", results);
    if (results.length==0) {
      res.status(400).json({
        "code" : 400,
        "data": results,
        "message": "No records found."
      })
    }
    res.status(200).json({
      "code" : 200,
      "data": results,
      "message": "Success"
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data": [],
      "message": error.message
    });
  })
})

// GET request to return balance of a particular account
// takes in a particular points account's id
router.get('/points', async (req,res) => {
  console.log(req.body);
  const mainId = req.body.mainId;
  /* The code is making a POST request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.getPointsBalance(mainId)
  .then((results) => {
    console.log("Results: ", results);
    if (results.length==0) {
      res.status(400).json({
        "code" : 400,
        "data": results,
        "message": "No records found."
      })
    }
    res.status(200).json({
      "code" : 200,
      "data" : results,
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

module.exports = router;

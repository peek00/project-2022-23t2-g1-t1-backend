var express = require('express');
var router = express.Router();
const allquery = require('../queries/query');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); 
});




// GET request to return balance of a particular account
router.get('/points', async (req,res) => {
  console.log(req.body);
  const mainId = req.body.mainId;
  /* The code is making a POST request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.getPointsBalance(mainId)
  .then((results) => {
    console.log("Results: ", results);
    res.status(201).json(results);
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json(error);
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

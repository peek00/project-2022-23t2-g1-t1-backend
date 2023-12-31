var express = require('express');
var router = express.Router();
const allquery = require('../queries/query');
const {unmarshall} = require("@aws-sdk/util-dynamodb");
const { v4:uuidv4} = require('uuid');
const e = require('express');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); 
});

// GET request to return all company_ids in the system
// does not take in any params or headers
router.get('/allcompanyids', async (req, res) => {
  try {
    const results = await allquery.getAllCompanyIds(); // Call the function to get all company IDs
    //console.log("Results: ", results);

    if (!results || results.length === 0) {
      return res.status(404).json({
        "code": 404,
        "logInfo": "Accessed /allcompanyids, status: 404",
        "message": "No company records found."
      });
    }

    return res.status(200).json({
      "code": 200,
      "logInfo": "Accessed /allcompanyids, status: 200",
      "data": results,
      "message": "Success"
    });
  } catch (error) {
    //console.log(error);
    return res.status(500).json({
      "code": 500,
      "logInfo": "Accessed /allcompanyids, status: 500",
      "message": error.message
    });
  }
});

router.get('/testing', function(req, res, next) {
  return res.status(200).json({
    "code" : 200,
    "logInfo":  "Accessed /testing, status: 200, points ms connection works",
    "data": [],
    "message": "Accessed /testing, status: 200, points ms connection works"
  })
})

// GET request to return all accounts by a particular user and company
// takes in a particular user_id and companyid
// GET request to return all accounts by a particular user and company
// takes in a particular user_id and companyid
router.get('/allaccounts', async(req,res) => {
  //console.log(req.headers);
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  const userId = req.headers.userid;
  allquery.getAllAccounts(userId,companyId)
  .then((results) => {
    //console.log("Results: ", results);
    if (results.length==0 || results == null) {
      return res.status(400).json({
        "code" : 400,
        "logInfo": userId + " accessed '/allaccounts', status: 400",
        "data": results,
        "message": "No records found."
      })
    } else {
      return res.status(200).json({
        "code" : 200,
        "logInfo": userId + " accessed '/allaccounts', status: 200",
        "data": results,
        "message": "Success"
      });
    }
  })
  .catch((error) => {
    //console.log(error);
    return res.status(500).json({
      "code" : 500,
      "logInfo": userId + " accessed '/allaccounts', status: 500",
      "data": [],
      "message": error.message
    });
  })
})

router.get('/getoneaccount', async(req,res) => {
  const companyId = req.query.company_id;
  const userId = req.query.user_id;

  allquery.getAllAccounts(userId,companyId)
  .then((results) => {
    //console.log("Results: ", results);
    if (results == null || results.length==0) {
      return res.status(400).json({
        "code" : 400,
        "logInfo": userId + " accessed '/getoneaccount', status: 400",
        "data": results,
        "message": "No records found."
      })
    } else {
      return res.status(200).json({
        "code" : 200,
        "logInfo": userId + " accessed '/getoneaccount', status: 200",
        "data": results,
        "message": "Success"
      });
    }
  })
  .catch((error) => {
    //console.log(error);
    return res.status(500).json({
      "code" : 500,
      "logInfo": userId + " accessed '/getoneaccount', status: 500",
      "data": [],
      "message": error.message
    });
  })
})

// GET request to return all user_ids of a particular company_id
// takes in companyid in request body
router.get('/alluseraccounts', async(req, res) => {
  //console.log(req.headers);
  const companyId = req.body.company_id;
  // Check for companyId 
  if (!companyId) {
    return res.status(400).json({
      "code": 400,
      "message": "CompanyId is required."
    });
  }

  else {
    try {
      const results = await allquery.getAllUserIdsByCompanyId(companyId); 
      //console.log("Results: ", results);

      if (!results || results.length === 0) {
        return res.status(404).json({
          "code" : 404,
          "logInfo": `Company ID: ${companyId} accessed '/alluseraccounts', status: 404`,
          "data": [],
          "message": "No records found."
        });
      } else {
        return res.status(200).json({
        "code" : 200,
        "logInfo": `Company ID: ${companyId} accessed '/alluseraccounts', status: 200`,
        "data": results,
        "message": "Success"
      })};
    } catch (error) {
      //console.log(error);
      return res.status(500).json({
        "code" : 500,
        "logInfo": `Company ID ${companyId} accessed '/alluseraccounts', status: 500`,
        "data": [],
        "message": error.message
      });
    }
  }
});

// GET request that returns all points account by a particular company_id
// returns all info of each user_id under the company_id
router.get('/allidsbycompany', async(req, res) => {

  const companyId = req.query.company_id; 
  // Check if the companyId is provided
  if (!companyId) {
    return res.status(400).json({
      "code": 400,
      "message": "CompanyId header is required."
    });
  }
  else {
    try {
      const results = await allquery.getAllIdsByCompanyId(companyId);
      //console.log("Results: ", results);

      // Check if there are results
      if (!results || results.length === 0) {
        return res.status(404).json({
          "code": 404,
          "logInfo": `Company ID ${companyId} accessed '/allidsbycompany', status: 404`,
          "message": "No accounts found for the provided company ID."
        });
      }

      // If there are results, return them
      else {
        return res.status(200).json({
          "code": 200,
          "logInfo": `Company ID ${companyId} accessed '/allidsbycompany', status: 200`,
          "data": results,
          "message": "Success"
        })
      };
    } catch (error) {
      //console.log(error);
      return res.status(500).json({
        "code": 500,
        "logInfo": `Company ID ${companyId} accessed '/allidsbycompany', status: 500`,
        "message": error.message
      });
    }
  }
});


// GET request that returns all points account by a particular user_id
router.get('/allpointsaccounts', async(req,res) => {
  //console.log(req.headers);
  // const companyId = req.headers.companyid;
  const userId = req.headers.userid;
  if (!userId) {
    return res.status(400).json({
      "code": 400,
      "message": "UserId is required."
    });
  }
  else {
    allquery.getAllAccountsByUserId(userId)
    .then((results) => {
      //console.log("Results: ", results);
      if (results.length==0) {
        return res.status(404).json({
          "code" : 404,
          "logInfo": userId + " accessed all /allpointsaccounts, status: 404",
          "data": results,
          "message": "No records found."
        })
      }
      else {
        return res.status(200).json({
          "code" : 200,
          "logInfo": userId + " accessed '/allpointsaccounts', status: 200",
          "data": results,
          "message": "Success"
        })
      };
    })
    .catch((error) => {
      //console.log(error);
      return res.status(500).json({
        "code" : 500,
        "logInfo": userId + " accessed '/allpointsaccounts', status: 500",
        "data": [],
        "message": error.message
      });
    })
  }
})

// WHEN USER_ID IS IN REQ.BODY - ADMIN USE
// GET request that returns all points account by a particular user_id through req.body
router.get('/allpointsaccountsAdmin', async(req,res) => {
  // //console.log(req.body);
  // const adminUserId = req.headers.userid;
  // const userId = req.body.user_id;
  const userId = req.query.user_id; 

  if (!userId) {
    return res.status(400).json({
      "code": 400,
      "message": "UserId is required."
    });
  }
  else {
    allquery.getAllAccountsByUserId(userId)
    .then((results) => {
      //console.log("Results: ", results);
      if (results.length==0) {
        return res.status(404).json({
          "code" : 404,
          "logs_info": "accessed '/allpointsaccountsAdmin', status: 500",
          "data": results,
          "message": "No records found."
        })
      }
      const filteredResults = {}
      for (let i=0;i<results.length;i++) {
        let info = results[i];
        // find the company id
        let companyname = info["company_id"]
        if (companyname in filteredResults){
          filteredResults[companyname].push(info);
        } else{
          filteredResults[companyname] = [info];
        }
      }
      return res.status(200).json({
        "code" : 200,
        "logs_info": " accessed '/allpointsaccountsAdmin' for user:" + userId + ", status: 200",
        "data": filteredResults,
        "message": "Success"
      });
    })
    .catch((error) => {
      //console.log(error);
      return res.status(500).json({
        "code" : 500,
        "logs_info": " accessed '/allpointsaccountsAdmin', status: 500",
        "data": [],
        "message": error.message
      });
    })
  }
})

// GET request to return details of a particular account
// takes in a particular points account's id and company id
router.get('/accdetails', async (req,res) => {
  //console.log(req.body);
  const companyId = req.body.company_id;
  const pointsId = req.body.pointsid;
  //console.log(companyId);
  //console.log(pointsId);
  /* The code is making a GET request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.getPointsBalance(companyId,pointsId)
  .then((results) => {
    //console.log("Results: ", results);
    if (results == null ){
      return res.status(400).json({
            "code" : 400,
            "data": results,
            "message": "No record of points account found."
          })
    }
    else {
      return res.status(200).json({
        "code" : 200,
        "logInfo": "Accessed '/accdetails' for points account {pointsId}, status: 200",
        "data" : results,
        "message" : "Success"
      });
    }
  })
  .catch((error) => {
    //console.log(error);
    return res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

// GET request to return if a particular account exists
// takes in a particular points account's id
router.get('/validate', async (req,res) => {
  //console.log(req.body);
  const companyId = req.body.company_id;
  const pointsId = req.body.pointsid;
  /* The code is making a GET request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.pointsAccExist(companyId,pointsId)
  .then((results) => {
    //console.log(results);
    return res.send(results);
  })
  .catch((error) => {
    //console.log(error);
    return res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

// POST request to create a new points balance account
// takes in user_id and input balance 
router.post('/createAccount', async (req,res) => {
  const companyId = req.body.company_id;
  const userId = req.body.user_id;
  const inputbalance = req.body.balance;
  const new_pointsId = uuidv4();
  //console.log(companyId);
  //console.log(userId)
  //console.log(inputbalance)
  //console.log("uuid: " + new_pointsId)
  allquery.pointsAccExist(companyId, new_pointsId)
  .then((results) => {
    if (!results) {
      //console.log("valid unique points_balance id");
      // if no such points_id balance, then create the account
      allquery.createAccount(companyId, userId, new_pointsId, inputbalance)
      .then((newresults) => {
        const status = newresults.$metadata.httpStatusCode;
        if (status == 200) {
          return res.status(200).json({
            "code": 200,
            "logInfo": "Accessed '/createAccount', new points account created, status: 200",
            "data": newresults,
            "message": "Account successfully created"
          });
        }
      })
      .catch((err) => {
        //console.log(err);
        return res.status(500).json({
          "code" : 500,
          "data" : [],
          "message" : err.message
        });
      })
    }
    //points acc id already exists
    else {
      return res.status(400).json({
        "code" : 400,
        "data": [],
        "message" : 'Points Balance ID already exists'
      })
    }
  })
  .catch((error) => {
    //console.log(error);
    return res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })  
})

// POST request to delete a points balance account
// takes in pointsId
router.delete('/deleteAccount', function(req,res){
  //console.log(req.headers);
  const companyId = req.body.company_id;
  const userId = req.headers.userid;

  allquery.userAccExist(companyId,userId)
  .then((ifexist) => {
    // if points account exist, then proceed with deleting
    if (ifexist) {
      allquery.deleteAccount(companyId, userId)
      .then((results) => {
          return res.status(200).json({
            "code": 200,
            "logInfo": "Accessed '/deleteAccount', points account deleted, status: 200",
            "data": results,
            "message": "Account successfully deleted"
          })
      })
      .catch((err) => {
        //console.log(err);
        return res.status(500).json({
          "code": 500,
          "logInfo": "Accessed '/deleteAccount', points account failed to delete, status: 500",
          "data": [],
          "message": err.message
        })
      })
    }
    else {
      //console.log("No such points accounts exist")
      return res.status(400).json({
        "code": 400,
        "logInfo": "Accessed '/deleteAccount', no points account to delete, status: 400",
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
  //console.log(req.headers);
  const userId = req.headers.userid;
  const companyId = req.body.company_id;
  const balance = req.body.newbalance;
  allquery.userAccExist(companyId, userId)
  .then((results) => {
    if (results){
      allquery.updatePoints(companyId,userId,balance)
      .then((newresults) => {
        const status = newresults.$metadata.httpStatusCode;
        if (status == 200) {
          return res.status(200).json({
            "code" : 200,
            "logInfo": "Accessed '/updatebalance', points account balance updated, status: 200",
            "data" : newresults,
            "message" : "Update Success"
          });
        }
      })
      .catch((err) => {
        //console.log(err);
        return res.status(500).json({
          "code" : 500,
          "logInfo": "Accessed '/updatebalance', points account balance failed to update, status: 500",
          "data" : [],
          "message" : err.message
        });
      })
    }
    else {
      return res.status(400).json({
        "code" : 400,
        "logInfo": "Accessed '/updatebalance', no such points account balance to update, status: 400",
        "data" : [],
        "message" : "No record of points account found."
      })
    }
  })
  .catch((error) => {
    //console.log(error);
    return res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

// POST Request to change balance of a user account
router.post('/changeBalance', function(req,res,next) {
  ////console.log(req.headers);
  //console.log(req.body);
  const change = req.body.change;
  const companyId = req.body.company_id;
  const userId = req.body.user_id;
  allquery.userAccExist(companyId, userId)
  .then((results) => {
    if (results){
      allquery.modifyPoints(companyId,userId,change)
      .then((newresults) => {
        const status = newresults.$metadata.httpStatusCode;
        if (status == 200) {
          return res.status(200).json({
            "code" : 200,
            "logInfo": "Accessed '/changeBalance', points account balance updated, status: 200",
            "data" : newresults,
            "message" : "Update Success"
          });
        }
      })
      .catch((err) => {
        //console.log(err);
        return res.status(500).json({
          "code" : 500,
          "logInfo": "Accessed '/changeBalance', points account balance failed to update, status: 500",
          "data" : [],
          "message" : err.message
        });
      })
    }
    else {
      return res.status(400).json({
        "code" : 400,
        "logInfo": "Accessed '/changeBalance', no such points account balance to update, status: 400",
        "data" : [],
        "message" : "No record of points account found."
      })
    }
  })
  .catch((error) => {
    //console.log(error);
    return res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

module.exports = router;

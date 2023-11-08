var express = require('express');
var router = express.Router();
const allquery = require('../queries/query');
const {unmarshall} = require("@aws-sdk/util-dynamodb");
const { v4:uuidv4} = require('uuid');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); 
});

// GET request to return all company_ids in the system
// does not take in any params or headers
router.get('/allcompanyids', async (req, res) => {
  try {
    const results = await allquery.getAllCompanyIds(); // Call the function to get all company IDs
    console.log("Results: ", results);

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
    console.log(error);
    res.status(500).json({
      "code": 500,
      "logInfo": "Accessed /allcompanyids, status: 500",
      "message": error.message
    });
  }
});

// GET request to return all company_ids in the system
// does not take in any params or headers
// router.get('/allcompanyids', async (req, res) => {
//   try {
//     const results = await allquery.getAllCompanyIds(); // Call the function to get all company IDs
//     console.log("Results: ", results);

//     if (!results || results.length === 0) {
//       return res.status(404).json({
//         "code": 404,
//         "logInfo": "Accessed /allcompanyids, status: 404",
//         "message": "No company records found."
//       });
//     }

//     return res.status(200).json({
//       "code": 200,
//       "logInfo": "Accessed /allcompanyids, status: 200",
//       "data": results,
//       "message": "Success"
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       "code": 500,
//       "logInfo": "Accessed /allcompanyids, status: 500",
//       "message": error.message
//     });
//   }
// });

router.get('/testing', function(req, res, next) {
  res.status(200).json({
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
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  const userId = req.headers.userid;
  allquery.getAllAccounts(userId,companyId)
  .then((results) => {
    console.log("Results: ", results);
    if (results.length==0) {
      res.status(400).json({
        "code" : 400,
        "logInfo": userId + " accessed '/allaccounts', status: 400",
        "logInfo": userId + " accessed '/allaccounts', status: 400",
        "data": results,
        "message": "No records found."
      })
    }else{
      res.status(200).json({
        "code" : 200,
        "logInfo": userId + " accessed '/allaccounts', status: 200",
        "data": results,
        "message": "Success"
      });
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "logInfo": userId + " accessed '/allaccounts', status: 500",
      "data": [],
      "message": error.message
    });
  })
})

// GET request that returns all points account by a particular user_id
router.get('/allpointsaccounts', async(req,res) => {
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const userId = req.headers.userid;
  if (!userId) {
    return res.status(400).json({
      "code": 400,
      "message": "UserId is required."
    });
  }
  allquery.getAllAccountsByUserId(userId)
  .then((results) => {
    console.log("Results: ", results);
    if (results.length==0) {
      res.status(404).json({
        "code" : 404,
        "logInfo": userId + " accessed all /allpointsaccounts, status: 404",
        "data": results,
        "message": "No records found."
      })
    }
    res.status(200).json({
      "code" : 200,
      "logInfo": userId + " accessed '/allpointsaccounts', status: 200",
      "data": results,
      "message": "Success"
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "logInfo": userId + " accessed '/allpointsaccounts', status: 500",
      "data": [],
      "message": error.message
    });
  })
})

// GET request to return all user_ids of a particular company_id
// takes in companyid in request headers
router.get('/alluseraccounts', async(req, res) => {
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  // Check for companyId 
  if (!companyId) {
    return res.status(400).json({
      "code": 400,
      "message": "CompanyId is required."
    });
  }

  try {
    const results = await allquery.getAllUserIdsByCompanyId(companyId); 
    console.log("Results: ", results);

    if (!results || results.length === 0) {
      return res.status(404).json({
        "code" : 404,
        "logInfo": `Company ID ${companyId} accessed '/alluseraccounts', status: 404`,
        "data": [],
        "message": "No records found."
      });
    }

    return res.status(200).json({
      "code" : 200,
      "logInfo": `Company ID ${companyId} accessed '/alluseraccounts', status: 200`,
      "data": results,
      "message": "Success"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "logInfo": `Company ID ${companyId} accessed '/alluseraccounts', status: 500`,
      "data": [],
      "message": error.message
    });
  }
});

// GET request that returns all points account by a particular company_id
router.get('/allidsbycompany', async(req, res) => {
  // const companyId = req.headers.companyid; 
  const companyId = req.body.company_id;
  // Check if the companyId is provided
  if (!companyId) {
    return res.status(400).json({
      "code": 400,
      "message": "CompanyId header is required."
    });
  }

  try {
    // Using the modified function to get all ids for the companyId
    const results = await allquery.getAllIdsByCompanyId(companyId);
    console.log("Results: ", results);

    // Check if there are results
    if (!results || results.length === 0) {
      return res.status(404).json({
        "code": 404,
        "logInfo": `Company ID ${companyId} accessed '/allidsbycompany', status: 404`,
        "message": "No accounts found for the provided company ID."
      });
    }

    // If there are results, return them
    res.status(200).json({
      "code": 200,
      "logInfo": `Company ID ${companyId} accessed '/allidsbycompany', status: 200`,
      "data": results,
      "message": "Success"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      "code": 500,
      "logInfo": `Company ID ${companyId} accessed '/allidsbycompany', status: 500`,
      "message": error.message
    });
  }
});


// GET request that returns all points account by a particular user_id
router.get('/allpointsaccounts', async(req,res) => {
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const userId = req.headers.userid;
  if (!userId) {
    return res.status(400).json({
      "code": 400,
      "message": "UserId is required."
    });
  }
  allquery.getAllAccountsByUserId(userId)
  .then((results) => {
    console.log("Results: ", results);
    if (results.length==0) {
      res.status(404).json({
        "code" : 404,
        "logInfo": userId + " accessed all /allpointsaccounts, status: 404",
        "data": results,
        "message": "No records found."
      })
    }
    res.status(200).json({
      "code" : 200,
      "logInfo": userId + " accessed '/allpointsaccounts', status: 200",
      "data": results,
      "message": "Success"
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "logInfo": userId + " accessed '/allpointsaccounts', status: 500",
      "data": [],
      "message": error.message
    });
  })
})

// GET request to return all user_ids of a particular company_id
// takes in companyid in request headers
router.get('/alluseraccounts', async(req, res) => {
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  // Check for companyId 
  if (!companyId) {
    return res.status(400).json({
      "code": 400,
      "message": "CompanyId is required."
    });
  }

  try {
    const results = await allquery.getAllUserIdsByCompanyId(companyId); 
    console.log("Results: ", results);

    if (!results || results.length === 0) {
      return res.status(404).json({
        "code" : 404,
        "logInfo": `Company ID ${companyId} accessed '/alluseraccounts', status: 404`,
        "data": [],
        "message": "No records found."
      });
    }

    return res.status(200).json({
      "code" : 200,
      "logInfo": `Company ID ${companyId} accessed '/alluseraccounts', status: 200`,
      "data": results,
      "message": "Success"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "logInfo": `Company ID ${companyId} accessed '/alluseraccounts', status: 500`,
      "data": [],
      "message": error.message
    });
  }
});

// GET request to return details of a particular account
// takes in a particular points account's id and company id
router.get('/accdetails', async (req,res) => {
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  const pointsId = req.body.pointsid;
  // const pointsId = req.headers.pointsid;
  /* The code is making a GET request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.getPointsBalance(companyId,pointsId)
  .then((results) => {
    console.log("Results: ", results);
    if (results == null ){
      res.status(400).json({
            "code" : 400,
            "data": results,
            "message": "No record of points account found."
          })
    }
    res.status(200).json({
      "code" : 200,
      "logInfo": "Accessed '/accdetails' for points account {pointsId}, status: 200",
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
})

// GET request to return if a particular account exists
// takes in a particular points account's id
router.get('/validate', async (req,res) => {
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  const pointsId = req.headers.pointsid;
  /* The code is making a GET request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.pointsAccExist(companyId,pointsId)
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
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  const userId = req.headers.userid;
  const inputbalance = req.body.balance;
  // const inputbalance = req.headers.balance;
  const new_pointsId = uuidv4();
  console.log(companyId);
  console.log(userId)
  console.log(inputbalance)
  console.log("uuid: " + new_pointsId)
  // allquery.companyExists(companyId)
  // .then((companyresults) => {
  //   console.log(companyresults)
  //   if (companyresults) {
        // console.log("valid company id");
        allquery.pointsAccExist(companyId, new_pointsId)
        .then((results) => {
          if (!results) {
            console.log("valid unique points_balance id");
            // if no such points_id balance
            allquery.createAccount(companyId, userId, new_pointsId, inputbalance)
            .then((newresults) => {
              const status = newresults.$metadata.httpStatusCode;
              if (status ==200) {
                res.status(200).json({
                  "code": 200,
                  "logInfo": "Accessed '/createAccount', new points account created, status: 200",
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
    // }
    // else {
    //   res.status(400).json({
    //     "code" : 400,
    //     "data": [],
    //     "message" : 'Company ID do not exists'
    //   })
    // }
    
  // })
  // .catch((companyerror) => {
  //   console.log(companyerror);
  //   res.status(404).json({
  //     "code" : 404,
  //     "data" : [],
  //     "message" : error.message
  //   });
  // })
  
})

// POST request to delete a points balance account
// takes in pointsId
router.delete('/deleteAccount', function(req,res){
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  const pointsId = req.body.pointsid;
  // const pointsId = req.headers.pointsid;
  allquery.pointsAccExist(companyId,pointsId)
  .then((ifexist) => {
    // if points account exist, then proceed with deleting
    if (ifexist) {
      allquery.deleteAccount(companyId, pointsId)
      .then((results) => {
        // const status = results.$metadata.httpStatusCode;
        // if (status==200){
          res.status(200).json({
            "code": 200,
            "logInfo": "Accessed '/deleteAccount', points account deleted, status: 200",
            "data": results,
            "message": "Account successfully deleted"
          })
        // }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          "code": 500,
          "logInfo": "Accessed '/deleteAccount', points account failed to delete, status: 500",
          "data": [],
          "message": err.message
        })
      })
    }
    else {
      res.status(400).json({
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
  console.log(req.headers);
  // const companyId = req.headers.companyid;
  const companyId = req.body.company_id;
  const pointsId = req.body.pointsid;
  const balance = req.body.newbalance;
  // const pointsId = req.headers.pointsid;
  // const balance = req.headers.newbalance;
  allquery.pointsAccExist(companyId, pointsId)
  .then((results) => {
    if (results){
      allquery.updatePoints(companyId,pointsId,balance)
      .then((newresults) => {
        const status = newresults.$metadata.httpStatusCode;
        if (status == 200) {
          res.status(200).json({
            "code" : 200,
            "logInfo": "Accessed '/updatebalance', points account balance updated, status: 200",
            "data" : newresults,
            "message" : "Update Success"
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          "code" : 500,
          "logInfo": "Accessed '/updatebalance', points account balance failed to update, status: 500",
          "data" : [],
          "message" : err.message
        });
      })
    }
    else {
      res.status(400).json({
        "code" : 400,
        "logInfo": "Accessed '/updatebalance', no such points account balance to update, status: 400",
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

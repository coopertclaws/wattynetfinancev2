var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
var query = require('../../controllers/dbquery');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const okta = require("@okta/okta-sdk-nodejs");

const client = new okta.Client({
  orgUrl: process.env.ORGURL,
  token: process.env.TOKEN
});

router.use(methodOverride('_method'));

router.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }
  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});


router.get('/', function(req, res, next) {
    if (req.query.account) {
        console.log('account query sent');
        query.getVirtualAccount(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                // console.log(data.data);
                res.render('editvirtualaccount', { title: 'Edit Virtual Account Information',
                                                        account_array: data.data[0]
                                                    });
            }
        })


    } else {
        console.log('no query string');

        query.getAllVirtualAccounts(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                // console.log('virtual accounts retrieved: ' + data.data[0].id);
                res.locals.virtual_accounts = data.data;
                next();
            }
        })
    }}, function(req, res, next) {
        query.updateAllBalances(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                // console.log('Balances updated');
                next();
            }
        })

    }, function(req, res) {
    
        query.getAllVirtualAccounts(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                // console.log(data);
                res.render('displayallvirtualaccounts', { title: 'Virtual Accounts',
                                                    account_array: data.data
                                                });
        }
    })
});


// This is close to working, just need to add query to get all virtual accounts before updataing balance
// then getting all virtual accounts again.
// router.get('/', function(req, res, next) {
//     if (req.query.account) {
//         console.log('account query sent');
//         query.getVirtualAccount(req, res, function(data, error) {
//             if(error) {
//                 res.send('Something Broke!');
//             }
//             else {
//                 // console.log(data.data);
//                 res.render('editvirtualaccount', { title: 'Edit Virtual Account Information',
//                                                         account_array: data.data[0]
//                                                     });
//             }
//         })


//     } else {
//         console.log('no query string');

//         query.updateBalance(req, res, function(data, error) {
//             if(error) {
//                 res.send('Something Broke!');
//             }
//             else {
//                 console.log('Balance Updated!');
//                 next();
//             }
//         })
//     }}, function(req, res) {

    
//         query.getAllVirtualAccounts(req, res, function(data, error) {
//             if(error) {
//                 res.send('Something Broke!');
//             }
//             else {
//                 // console.log(data);
//                 res.render('displayallvirtualaccounts', { title: 'Virtual Accounts',
//                                                     account_array: data.data
//                                                 });
//         }
//     })
// });

// router.post('/', upload.single("uploadfile"), function(req, res, next) {
//     // Get user ID of logged in user
//     query.getUserByEmail(req, res, function(data, error) {
//       if(error) {
//           res.send('Something Broke!');
//       }
//       else {
//           // console.log('Data returned from getUserByEmail: ' + data.data[0].id);
//           res.locals.loggedinuser=data.data[0].id;
//           // res.send(data.data[0].name);
//           // res.redirect('manageuploads');
//           next();
//       }
//   })
  
//     }, function(req, res) {
//         // upload file
//         query.uploadFile(req, res, function(data, error) {
//             if(error) {
//                 res.send('Something Broke from 2nd function');
//             }
//             else {
//                 // console.log('LOVs retrieved: ' + data.data[0].name);
//                 // console.log('Array still has value: ' + res.locals.temp_data[0].description);
//                 res.redirect('manageuploads');
  
//                 // res.send(data);
//                 // res.redirect('virtualaccount');
//             }
//         })
//     }   
//   );

// Original Route if it all goes wrong!
// router.get('/', function(req, res) {
//     if (req.query.account) {
//         console.log('account query sent');
//         query.getVirtualAccount(req, res, function(data, error) {
//             if(error) {
//                 res.send('Something Broke!');
//             }
//             else {
//                 // console.log(data.data);
//                 res.render('editvirtualaccount', { title: 'Edit Virtual Account Information',
//                                                         account_array: data.data[0]
//                                                     });
//             }
//         })


//     } else {
//         // console.log('no query string');

//         query.getAllVirtualAccounts(req, res, function(data, error) {
//             if(error) {
//                 res.send('Something Broke!');
//             }
//             else {
//                 // console.log(data);
//                 res.render('displayallvirtualaccounts', { title: 'Virtual Accounts',
//                                                     account_array: data.data
//                                                 });
//         }
//     })
//     }

// });


router.post('/', function(req, res, next) {
    // Check that the logged in user has access to the physical account that has been passed in the request body
    query.validatePhysicalAccount(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
        }
        else {
            console.log('1st middleware executed');
            next();

        }
    })

    }, function(req, res) {
        // Create the virtual account
        query.createVirtualAccount(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                // console.log('2nd middleware executed');
                // res.send(data);
                res.redirect('virtualaccount');
            }
        })
    }   
);

router.put('/', function(req, res) {
    console.log('PUT request called');
    query.updateVirtualAccount(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
        }
        else {
            // res.send(data.data[0].name);
            res.redirect('virtualaccount');
        }
    })

});

module.exports = router;
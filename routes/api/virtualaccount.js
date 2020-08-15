var express = require('express');
var router = express.Router();
var query = require('../../controllers/dbquery');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const okta = require("@okta/okta-sdk-nodejs");

const client = new okta.Client({
  orgUrl: process.env.ORGURL,
  token: process.env.TOKEN
});

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


router.get('/', function(req, res) {
    if (req.query.account) {
        console.log('account query sent');
        query.getVirtualAccount(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                console.log(data.data);
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
                console.log(data);
                res.render('displayallvirtualaccounts', { title: 'Account Overview',
                                                    account_array: data.data
                                                });
        }
    })
    }

});




// router.get('/:id', function(req, res) {
//     query.getVirtualAccount(req, res, function(data, error) {
//         if(error) {
//             res.send('Something Broke!');
//         }
//         else {
//             // res.send(data.data[0].name);
//             res.render('displayvirtualaccount', { title: 'Virtual Account Information',
//                                                     name: data.data[0].name,
//                                                     physical_account: data.data[0].physical_account,
//                                                     starting_balance: data.data[0].starting_balance,
//                                                     current_balance: data.data[0].current_balance,
//                                                     amount: data.data[0].amount
//                                                 });
//         }
//     })

// });


// router.get('/', function(req, res) {
//     query.getAllVirtualAccounts(req, res, function(data, error) {
//         if(error) {
//             res.send('Something Broke!');
//         }
//         else {
//             console.log(data);
//             res.render('displayallvirtualaccounts', { title: 'Account Overview',
//                                                     account_array: data.data
//                                                 });
//         }
//     })

// });


router.post('/', function(req, res) {
    query.createVirtualAccount(req, res, function(data, error) {
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
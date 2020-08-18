var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
var query = require('../../controllers/dbquery');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const okta = require("@okta/okta-sdk-nodejs");

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

router.get('/', function(req, res) {
    if (req.query.account) {
        // This route takes an argument to supply detail for a single physical account
        // Not sure use case for this yet though so WIP
        // Renders to the wrong page at the minute anyhow
        query.getPhysicalAccount(req, res, function(data, error) {
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

        query.getAllPhysicalAccounts(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                console.log(data);
                console.log('something returned');
                // res.render('displayallvirtualaccounts', { title: 'Virtual Accounts',
                //                                     account_array: data.data
                //                                 });
                // res.send('some stuff');
                res.send(data.data);
        }
    })
    }

});

router.post('/', function(req, res, next) {
    // res.locals.id = req.params.id
    // console.log('create account route called');
    // console.log(req.body.name);
    next ()
},
query.createPhysicalAccount
);

module.exports = router;
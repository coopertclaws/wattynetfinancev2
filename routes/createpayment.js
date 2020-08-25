var express = require('express');
var router = express.Router();
var request = require('request');
var query = require('../controllers/dbquery');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const okta = require("@okta/okta-sdk-nodejs");

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
  query.getAllPhysicalAccounts(req, res, function(data, error) {
      if(error) {
          res.send('Something Broke!');
      }
      else {
          console.log('1st middleware executed');
          console.log(data.data);
          res.locals.initialdata = data;
          next();
      }
  })

}, function(req, res) {
    query.getAllVirtualAccounts(req, res, function(moredata, error) {
      if(error) {
        res.send('Something Broke!');
      }
      else {
        console.log('2nd middleware executed');
        console.log(moredata.data);
        res.render('createpayment', { title: 'Make a Payment', physical_account: res.locals.initialdata.data, virtual_account: moredata.data
        
      });
      }
    })
});
module.exports = router;
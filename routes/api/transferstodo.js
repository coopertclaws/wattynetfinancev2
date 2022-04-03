var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
var query = require('../../controllers/dbquery');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const okta = require("@okta/okta-sdk-nodejs");
const {check, validationResult} = require('express-validator');

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

router.get('/', function(req, res) {
    console.log('no query string');

    query.transfersToDo(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
            console.log('error');
        }
        else {
            console.log (data.data);
            res.render('displaytransferstodo', { title: 'Transfers To Do',
                                                    transfers_array: data.data
                                                });
        }
    })
 
});

module.exports = router;
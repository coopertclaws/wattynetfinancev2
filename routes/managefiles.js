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

// router.get('/'), function(req, res) {
//     console.log('managefiles route called');
//     res.render('manageuploads', { title: 'Manage Uploads'});

// };

router.get('/', function(req, res, next) {
    res.render('manageuploads', { title: 'Manage Uploads' });
  });
  
module.exports = router;
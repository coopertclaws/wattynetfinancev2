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


router.post('/', function(req, res, next) {
  // Update virtual pots
  query.updateTempFile(req, res, function(data, error) {
    if(error) {
        res.send('Something Broke!');
    }
    else {
        // res.send(data.data[0].name);
        // res.redirect('manageuploads');
        next();
    }
})

  }, function(req, res) {
      // delete entries
      console.log(req.body);
      query.deleteTempFileEntries(req, res, function(data, error) {
          if(error) {
              res.send('Something Broke from 2nd function');
          }
          else {
            // Add a bit of a delay so that database has updated before refresh. Clunky but mostly works
            setTimeout(function(){
              res.redirect('manageuploads');
            }, 2000)
          }
      })
  }   
);

module.exports = router;
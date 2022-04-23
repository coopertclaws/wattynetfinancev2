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
    // Get the temp file output
    query.getTempFile(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke from 1st function');
        }
        else {
            // console.log('Temp file retrieved: ' + data.data[0].description);
            res.locals.temp_data = data.data;
            next();

        }
    })

    }, function(req, res) {
        // get LOVs
        query.getAllVirtualAccounts(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke from 2nd function');
            }
            else {
                // console.log('LOVs retrieved: ' + data.data[0].name);
                // console.log('Array still has value: ' + res.locals.temp_data[0].description);
                res.locals.lovs = data.data;
                res.render('displaytempfile', { title: 'Manage Temporary Uploads',
                                                temp_data_array: res.locals.temp_data,
                                                lov_array: res.locals.lovs});
                // res.send(data);
                // res.redirect('virtualaccount');
            }
        })
    }   
);

module.exports = router;
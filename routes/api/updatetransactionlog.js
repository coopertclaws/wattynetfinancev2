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

router.post('/', function(req, res) {
    // console.log('no query string');

    query.updateTransactionLog(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
            console.log('error');
        }
        else {
            setTimeout(function(){
                res.redirect('transferstodo');
                // res.redirect('manageuploads');
              }, 2000)
            // console.log (data.data);

            // res.render('displaytransferstodo', { title: 'Transfers To Do',
            //                                         transfers_array: data.data
            //                                     });
        }
    })
 
});

module.exports = router;
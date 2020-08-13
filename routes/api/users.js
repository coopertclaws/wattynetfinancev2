var express = require('express');
var router = express.Router();
//var db = require('../../database');
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
router.get('/', query.getAllUsers);

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   db.query('SELECT * FROM user', function (error, results, fields) {
//     if (error) throw error;
//     return res.send({ error: false, data: results, message: 'users list.' });
//   });
// });

module.exports = router;

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


// Original route
// router.post('/', function(req, res, next) {

//     query.updateTempFile(req, res, function(data, error) {
//         if(error) {
//             res.send('Something Broke!');
//         }
//         else {
//             // res.send(data.data[0].name);
//             res.redirect('manageuploads');
//             // res.send(JSON.stringify(req.body));
//         }
//     })

// });

// router.post('/', function(req, res, next) {

//   query.updateTempFile(req, res, function(data, error) {
//       if(error) {
//           res.send('Something Broke!');
//       }
//       else {
//           // res.send(data.data[0].name);
//           // res.redirect('manageuploads');
//           next();
//       }
//   })

// });



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
              // console.log('LOVs retrieved: ' + data.data[0].name);
              // console.log('Array still has value: ' + res.locals.temp_data[0].description);
              res.redirect('manageuploads');

              // res.send(data);
              // res.redirect('virtualaccount');
          }
      })
  }   
);

module.exports = router;
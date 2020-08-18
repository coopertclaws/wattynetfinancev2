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


router.get('/', function(req, res) {
  query.getAllPhysicalAccounts(req, res, function(data, error) {
      if(error) {
          res.send('Something Broke!');
      }
      else {
          console.log(data.data);
          res.render('createvirtualaccount', { title: 'Create a Virtual Account', account_array: data.data
          });
      }
  })

});



// request('http://localhost:3000/api/physicalaccount', {json:true}, (err, res, body) => {
//   if(err) {
//     return console.log(err);
//   }
//   console.log(body);
//   console.log('data deffo returned');
// });

// router.get('/', function(req, res){ 

//   request('http://localhost:3000/api/physicalaccount', function (error, response, body) {
//         console.log('error:', error); // Print the error if one occurred and handle it
//         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//         res.send(body)
//   });

// })


// router.get('/', function(req, res, next) {
//   request({
//     uri: 'http://localhost:3000/api/physicalaccount',
//     json: true,
//     function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//         console.log('response returned!!!');
//         console.log(body);
//         res.json(body);
//       } else {
//         res.json(error);
//       }
//     }
//   });
// });


// router.get('/', function(req, res, next) {
//     res.render(
//       'createvirtualaccount',
//       {title : 'Create a Virtual Account'}
//     );
//   });

module.exports = router;
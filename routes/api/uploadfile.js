var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
var query = require('../../controllers/dbquery');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const okta = require("@okta/okta-sdk-nodejs");
const {check, validationResult} = require('express-validator');
var multer = require('multer');
var fs = require('fs');
var csv = require('fast-csv');
var path = require('path');
var db = require('../../database');

// router.use(methodOverride('_method'));

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, './uploads/')
    },
    filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  
  var upload = multer({
    storage: storage
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

// Might not need this route
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
  });


// router.post('/', upload.single("uploadfile"), function(req, res) {
//   query.uploadFile(req, res, function(data, error) {
//     if(error) {
//       res.send('Something Broke!');
//       console.log('error');
//     }
//     else {
//       console.log (data.data);
//       res.redirect('manageuploads');
//       // res.render('displayuploadsuccess', { title: 'Upload Success',
//       //                                         // transfers_array: data.data
//       //                                     });
//     }

//   })
// })


router.post('/', upload.single("uploadfile"), function(req, res, next) {
  // Get user ID of logged in user
  query.getUserByEmail(req, res, function(data, error) {
    if(error) {
        res.send('Something Broke!');
    }
    else {
        // console.log('Data returned from getUserByEmail: ' + data.data[0].id);
        res.locals.loggedinuser=data.data[0].id;
        // res.send(data.data[0].name);
        // res.redirect('manageuploads');
        next();
    }
})

  }, function(req, res) {
      // upload file      
      query.uploadFile(req, res, function(data, error) {
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


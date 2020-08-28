var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
var query = require('../../controllers/dbquery');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const okta = require("@okta/okta-sdk-nodejs");
const {check, validationResult} = require('express-validator');

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

// This function does two things:
// Creates a payment in the transactions table
// Updates the balance in the relevant virtual account
router.post('/', [
    check('desc')
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage('No special characters allowed')
], function(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('error', { error_array: errors.errors[0]});
        console.log(errors.errors[0].msg);
    } else {
    
        query.makeDeposit(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                next();
            }
        })
    }
}, function(req, res) {
    query.updateBalance(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
        }
        else {
            res.redirect('transaction');
        }
    })
});

// Not set up for deposits yet!!!
router.put('/', [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is Required')
    .isAlphanumeric()
    .withMessage('No special characters allowed')
], function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() })
        res.render('error', { error_array: errors.errors[0]});
        console.log(errors.errors[0].msg);
    } else {
        query.updatePhysicalAccount(req, res, function(data, error) {
            if(error) {
                res.send('Something Broke!');
            }
            else {
                // res.send(data.data[0].name);
                res.redirect('physicalaccount');
            }
        })
    }
});



module.exports = router;
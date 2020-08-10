var express = require('express');
var router = express.Router();
var query = require('../../controllers/dbquery');

router.post('/', function(req, res, next) {
    // res.locals.id = req.params.id
    // console.log('create account route called');
    // console.log(req.body.name);
    next ()
},
query.createPhysicalAccount
);

module.exports = router;
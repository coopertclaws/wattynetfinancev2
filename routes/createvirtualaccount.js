var express = require('express');
var router = express.Router();
var query = require('../controllers/dbquery');

router.get('/', function(req, res, next) {
    res.render(
      'createvirtualaccount',
      {title : 'Create a Virtual Account'}
    );
  });

module.exports = router;
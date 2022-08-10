require('dotenv').config();

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Wattynet Finance', environment: process.env.ENVIRONMENT });
});

module.exports = router;

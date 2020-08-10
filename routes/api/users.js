var express = require('express');
var router = express.Router();
//var db = require('../../database');
var query = require('../../controllers/dbquery');

router.get('/', query.getAllUsers);

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   db.query('SELECT * FROM user', function (error, results, fields) {
//     if (error) throw error;
//     return res.send({ error: false, data: results, message: 'users list.' });
//   });
// });

module.exports = router;
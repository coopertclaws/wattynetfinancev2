var express = require('express');
var router = express.Router();
var query = require('../../controllers/dbquery');

var app = module.exports = express();
const basicAuth = require('express-basic-auth');

//router.get('/', query.getAllUsers);

// router.get('/:id', function(req, res, next) {
//     res.locals.id = req.params.id
//     next ()
// },
// query.getUser
// );

// app.use(basicAuth({
//   users: { admin: `${process.env.ADMINPASS}` },
//   challenge: true
// }));

router.get('/:id', (basicAuth({
    users: { admin: `${process.env.ADMINPASS}` },
    challenge: true
  })),
  function(req, res, next) {
    res.locals.id = req.params.id
    next ()
},
query.getUser
);




// var db = require('../database');

// /* GET users listing. */
// router.get('/:id', function(req, res, next) {
//   db.query('SELECT * FROM user WHERE id = ' + req.params.id, function (error, results, fields) {
//     if (error) throw error;
//     return res.send({ error: false, data: results, message: 'users list.' });
//   });
// });

module.exports = router;
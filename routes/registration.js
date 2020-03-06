var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    console.log(users)
    res.render(
      'registration',
      {title : 'Add a User', users : users}
    );
  });
});

/* POST form. */
router.post('/', function(req, res, next) {
  new User({
    name : req.body.name,
    email : req.body.email,
    dob : req.body.dob,
    weight : req.body.weight
  })
  .save(function(err, user) {
    console.log(user.name)
    res.redirect('users');
  });
});

module.exports = router;

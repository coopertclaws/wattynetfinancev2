var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    res.render(
      'users',
      {title : 'List of users', users : users}
    );
  });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  User.findByIdAndRemove({_id: req.body.userlist},
    function(err, docs){
      if(err) res.json(err);
      else res.redirect('users');
    });
});
module.exports = router;

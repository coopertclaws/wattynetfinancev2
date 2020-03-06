var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('products');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Product.find(function(err, products) {
    res.render(
      'productlist',
      {title : 'List of products', products : products}
    );
  });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  Product.findByIdAndRemove({_id: req.body.productlist},
    function(err, docs){
      if(err) res.json(err);
      else res.redirect('productlist');
    });
});

module.exports = router;

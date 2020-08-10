var express = require('express');
var router = express.Router();
var query = require('../../controllers/dbquery');

router.get('/:id', function(req, res) {
    query.getVirtualAccount(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
        }
        else {
            res.send(data.data[0].name);
        }
    })

});


// router.get('/:id', function(req, res, next) {
//     query.getVirtualAccount(function() {
//         console.log(res.locals.results);
//     });
//     next ()
// });

router.post('/', function(req, res, next) {
    next ()
},
query.createVirtualAccount
);

module.exports = router;
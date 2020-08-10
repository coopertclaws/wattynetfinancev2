var express = require('express');
var router = express.Router();
var query = require('../../controllers/dbquery');


router.get('/:id', function(req, res) {
    query.getVirtualAccount(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
        }
        else {
            // res.send(data.data[0].name);
            res.render('displayvirtualaccount', { title: 'Virtual Account Information',
                                                    name: data.data[0].name,
                                                    physical_account: data.data[0].physical_account,
                                                    starting_balance: data.data[0].starting_balance,
                                                    current_balance: data.data[0].current_balance,
                                                    amount: data.data[0].amount
                                                });
        }
    })

});

router.get('/', function(req, res) {
    res.locals.user='21';
    query.getAllVirtualAccounts(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
        }
        else {
            
            res.send(data);
            // res.send(data.data[0].name);
        //     res.render('displayvirtualaccount', { title: 'Virtual Account Information',
        //                                             name: data.data[0].name,
        //                                             physical_account: data.data[0].physical_account,
        //                                             starting_balance: data.data[0].starting_balance,
        //                                             current_balance: data.data[0].current_balance,
        //                                             amount: data.data[0].amount
        //                                         });
        }
    })

});



// router.get('/', function(req, res) {
//     console.log('No parameters called');
//     res.send('No parameters called');
// });

router.post('/', function(req, res) {
    query.createVirtualAccount(req, res, function(data, error) {
        if(error) {
            res.send('Something Broke!');
        }
        else {
            // res.send(data.data[0].name);
            res.redirect('virtualaccount');
        }
    })

});






// router.post('/', function(req, res, next) {
//     res.redirect('virtualaccount');
// },
// query.createVirtualAccount
// );


// router.post('/', function(req, res, next) {
//     next ()
// },
// query.createVirtualAccount
// );





module.exports = router;
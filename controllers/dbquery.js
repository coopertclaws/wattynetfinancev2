// DB Connection
var db = require('../database');

exports.getAllUsers = function(req,res) {
    var results = db.query('SELECT * FROM user', function (error, results, fields) {
        res.send(results);
    });
};

exports.getUser = function(req, res, next) {
    var results = db.query('SELECT * FROM user WHERE id =' + req.params.id, function (error, results, fields) {
        res.send(results);
    });
};

exports.createPhysicalAccount = function(req, res, next) {
    var results = db.query("INSERT INTO physical_account (user, name) VALUES (" + req.body.user + ", " + "'" + req.body.name + "')", function (error, results, fields) {
        res.send(results);
        console.log('name: ' + req.body.name);
        console.log('user: ' + req.body.user);
    });
};

exports.createVirtualAccount = function(req, res, next) {
    var results = db.query("INSERT INTO virtual_account (user, name, physical_account) VALUES (" + req.body.user + ", " + "'" + req.body.name + "'," + req.body.physical_account + ")", function (error, results, fields) {
        if (error) {
            next(null,{
                status: "error",
                message: error
            });
        }

        next({
            status: "success",
            message: "data retrieved",
            data: results
        }, null);
    });
};

exports.updateVirtualAccount = function(req, res, next) {
    console.log('update account controller called');
    var results = db.query("UPDATE virtual_account INNER JOIN user ON user.id = virtual_account.user SET virtual_account.amount = '" + req.body.amount + "', virtual_account.name = '" + req.body.name + "' WHERE (virtual_account.id = " + req.body.id + " AND user.email='" + req.userContext.userinfo.preferred_username + "')", function (error, results, fields) {
        if (error) {
            next(null,{
                status: "error",
                message: error
            });
        }

        next({
            status: "success",
            message: "data retrieved",
            data: results
        }, null);
    });
};


exports.getVirtualAccount = function(req, res, next) {
    console.log(req.query);
    var results = db.query("SELECT virtual_account.id, virtual_account.amount, virtual_account.current_balance, virtual_account.name, virtual_account.starting_balance, physical_account.name AS real_account FROM virtual_account INNER JOIN user ON user.id = virtual_account.user INNER JOIN physical_account ON physical_account.id = virtual_account.physical_account WHERE user.email = " + "'" + req.userContext.userinfo.preferred_username + "'" + " AND virtual_account.id = " + req.query.account, function (error, results, fields) {
        res.locals.results = results;
        if (error) {
            next(null,{
                status: "error",
                message: error
            });
        }

        next({
            status: "success",
            message: "data retrieved",
            data: results
        }, null);
    });
  
};

exports.getAllVirtualAccounts = function(req, res, next) {
    var results = db.query("SELECT virtual_account.id, virtual_account.name, virtual_account.current_balance, virtual_account.amount, virtual_account.starting_balance, physical_account.name AS real_account FROM virtual_account INNER JOIN user ON user.id = virtual_account.user INNER JOIN physical_account ON physical_account.id = virtual_account.physical_account WHERE user.email = " + "'" + req.userContext.userinfo.preferred_username + "'", function(error, results, fields) {
        if (error) {
            next(null, {
                status: "error",
                message: error
            });
        }

        next({
            status: "success",
            message: "data retreived",
            data: results
        }, null);
    });
};


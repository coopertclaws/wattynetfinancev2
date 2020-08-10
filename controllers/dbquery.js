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

exports.getVirtualAccount = function(req, res, next) {
    var results = db.query("SELECT * FROM virtual_account WHERE id = " + req.params.id, function (error, results, fields) {
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
    var results = db.query("SELECT * FROM virtual_account WHERE user = " + res.locals.user, function(error, results, fields) {
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
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

exports.getAllPhysicalAccounts = function(req, res, next) {
        console.log('controller called');
        // var results = db.query('SELECT * from physical_account', function(error, results, fields) {
        var results = db.query("SELECT physical_account.id, physical_account.name FROM physical_account INNER JOIN user ON user.id = physical_account.user WHERE user.email = " + "'" + req.userContext.userinfo.preferred_username + "'", function(error, results, fields) {
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

exports.getPhysicalAccount = function(req, res, next) {
    console.log(req.query);
    var results = db.query("SELECT physical_account.id, physical_account.name FROM physical_account INNER JOIN user ON user.id = physical_account.user WHERE user.email = " + "'" + req.userContext.userinfo.preferred_username + "'" + " AND physical_account.id = " + req.query.account, function (error, results, fields) {
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

exports.createPhysicalAccount = function(req, res, next) {
    console.log("INSERT INTO physical_account (user, name) VALUES ('" + req.userContext.userinfo.preferred_username + "', " + "'" + req.body.name + "')");
    var results = db.query("INSERT INTO physical_account (user, name) VALUES ((SELECT id FROM user WHERE email ='" + req.userContext.userinfo.preferred_username + "'), " + "'" + req.body.name + "')", function (error, results, fields) {
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

exports.updatePhysicalAccount = function(req, res, next) {
    var results = db.query("UPDATE physical_account INNER JOIN user ON user.id = physical_account.user SET physical_account.name = '" + req.body.name + "' WHERE (physical_account.id = " + req.body.id + " AND user.email='" + req.userContext.userinfo.preferred_username + "')", function (error, results, fields) {
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

exports.validatePhysicalAccount = function(req, res, next) {
    var results = db.query("SELECT physical_account.id FROM physical_account INNER JOIN user ON user.id = physical_account.user WHERE (physical_account.id = '" + req.body.account_id + "' AND user.email = '" + req.userContext.userinfo.preferred_username + "')", function (error, results, fields) {

        // console.log(results[0].id);
        // if (error) {
        if (results[0].id != req.body.account_id) {
            next(null,{
                status: "error",
                message: error

            });
        }

            next({
                status: "success",
                message: "data retrieved",
                data: "Check succeeded"
            }, null);
        });

};

exports.createVirtualAccount = function(req, res, next) {
    var results = db.query("INSERT INTO virtual_account (user, name, physical_account, amount, starting_balance) VALUES ((SELECT id FROM user WHERE email = '" + req.userContext.userinfo.preferred_username + "'), '" + req.body.name + "', '" + req.body.account_id + "', '" + req.body.amount + "', '" + req.body.starting_balance + "')", function (error, results, fields) {
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

exports.makePayment = function(req, res, next) {
    //console.log("INSERT INTO transactions (user, virtual_account, tofrom, amount, desc) VALUES ((SELECT id FROM user WHERE email = '" + req.userContext.userinfo.preferred_username + "'), '" + req.body.virtual_account_id + "', '" + req.body.physical_account_id + "', '" + req.body.amount + "', '" + req.body.desc + "')");
    var results = db.query("INSERT INTO transactions (user, virtual_account, tofrom, amount, description) VALUES ((SELECT id FROM user WHERE email = '" + req.userContext.userinfo.preferred_username + "'), '" + req.body.virtual_account_id + "', '" + req.body.physical_account_id + "', '" + req.body.amount + "', '" + req.body.desc + "')", function (error, results, fields) {
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
// DB Connection
var db = require('../database');
var fs = require('fs');
var csv = require('fast-csv');
var path = require('path');
var multer = require('multer');
var moment = require('moment');

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
        // console.log('controller called');
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
    // console.log(req.query);
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
    // console.log("INSERT INTO physical_account (user, name) VALUES ('" + req.userContext.userinfo.preferred_username + "', " + "'" + req.body.name + "')");
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
    var results = db.query("INSERT INTO virtual_account (user, name, physical_account, amount, current_balance, starting_balance) VALUES ((SELECT id FROM user WHERE email = '" + req.userContext.userinfo.preferred_username + "'), '" + req.body.name + "', '" + req.body.account_id + "', '" + req.body.amount + "', '" + req.body.starting_balance + "', '" + req.body.starting_balance + "')", function (error, results, fields) {
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
    // console.log('update account controller called');
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
    // console.log(req.query);
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
        // console.log(results);
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
    // Create an entry in the transactions table - append a '-ve' to the amount since it's a payment
    // Use SELECT statement to retrieve user id from users table based on logged in user
    // Use SELECT statement to also verify user id exists within appropriate row of corresponding virtual account table
    var results = db.query("INSERT INTO transactions (user, virtual_account, tofrom, amount, description) VALUES ((SELECT id FROM user WHERE email = '" + req.userContext.userinfo.preferred_username + "'), (SELECT id FROM virtual_account WHERE id = '" + req.body.virtual_account_id + "' AND user = (SELECT id FROM user WHERE email = '" + req.userContext.userinfo.preferred_username + "')), '" + req.body.physical_account_id + "', '-" + req.body.amount + "', '" + req.body.desc + "')", function (error, results, fields) {
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

exports.makeDeposit = function(req, res, next) {
    // Create an entry in the transactions table
    // Use SELECT statement to retrieve user id from users table based on logged in user
    // Use SELECT statement to also verify user id exists within appropriate row of corresponding virtual account table
    var results = db.query("INSERT INTO transactions (user, virtual_account, tofrom, amount, description) VALUES ((SELECT id FROM user WHERE email = '" + req.userContext.userinfo.preferred_username + "'), (SELECT id FROM virtual_account WHERE id = '" + req.body.virtual_account_id + "' AND user = (SELECT id FROM user WHERE email = '" + req.userContext.userinfo.preferred_username + "')), '" + req.body.physical_account_id + "', '" + req.body.amount + "', '" + req.body.desc + "')", function (error, results, fields) {
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

exports.updateBalance = function(req, res, next) {
    // console.log("UPDATE virtual_account SET current_balance = ((starting_balance) + (SELECT SUM(amount) AS balance FROM transactions WHERE virtual_account = '" + req.body.virtual_account_id + "')) WHERE id = '" + req.body.virtual_account_id + "'");
    var results = db.query("UPDATE virtual_account SET current_balance = ((starting_balance) + (SELECT SUM(amount) AS balance FROM transactions WHERE virtual_account = '" + req.body.virtual_account_id + "')) WHERE id = '" + req.body.virtual_account_id + "'", function(error, results, fields) {
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

exports.getAllTransactions = function(req, res, next) {
    var results = db.query("SELECT transactions.id, transactions.timestamp, transactions.amount, transactions.description, virtual_account.name AS virtual_account_name, physical_account.name AS physical_account_name FROM transactions INNER JOIN virtual_account ON virtual_account.id = transactions.virtual_account INNER JOIN physical_account ON physical_account.id = transactions.tofrom WHERE transactions.user = (SELECT id FROM USER WHERE email = '" + req.userContext.userinfo.preferred_username + "') ORDER BY TIMESTAMP DESC", function(error, results, fields) {
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

exports.getTransaction = function(req, res, next) {
    var results = db.query("SELECT transactions.id, transactions.timestamp, transactions.amount, transactions.description, virtual_account.name AS virtual_account_name, physical_account.name AS physical_account_name, transactions.virtual_account AS virtual_account_id FROM transactions INNER JOIN virtual_account ON virtual_account.id = transactions.virtual_account INNER JOIN physical_account ON physical_account.id = transactions.tofrom WHERE (transactions.user = (SELECT id FROM USER WHERE email = '" + req.userContext.userinfo.preferred_username + "') AND transactions.id = '" + req.query.transaction + "') ORDER BY TIMESTAMP DESC", function(error, results, fields) {
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

exports.updateTransaction = function(req, res, next) {
//    console.log('update transaction controller called');
//    console.log("UPDATE transactions SET amount = '" + req.body.amount + "', description = '" + req.body.description + "' WHERE transaction.id = " + req.body.id + " AND user = (SELECT id from user WHERE email='" + req.userContext.userinfo.preferred_username + "')");
    var results = db.query("UPDATE transactions SET amount = '" + req.body.amount + "', description = '" + req.body.description + "' WHERE transactions.id = " + req.body.id + " AND user = (SELECT id from user WHERE email='" + req.userContext.userinfo.preferred_username + "')", function (error, results, fields) {
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

exports.transfersToDo = function(req, res, next) {
    var results = db.query("SELECT transactions.timestamp, transactions.amount, transactions.description, transactions.virtual_account, virtual_account.name AS virtual_account_name, virtual_account.physical_account AS from_physical_account_name, transactions.tofrom AS to_physical_account_name, pseudo1.name AS real_from, pseudo2.name AS real_to FROM transactions INNER JOIN virtual_account ON virtual_account.id = transactions.virtual_account INNER JOIN physical_account pseudo1 ON pseudo1.id = virtual_account.physical_account INNER JOIN physical_account pseudo2 ON pseudo2.id = transactions.tofrom WHERE ((transactions.user = (SELECT id FROM USER WHERE email = '" + req.userContext.userinfo.preferred_username + "')) AND (DATE(timestamp) = CURDATE())) ORDER BY TIMESTAMP DESC", function(error, results, fields) {
        // console.log(results[0]);
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

exports.uploadFile = function(req, res, next) {
    // console.log('Source Account:' + req.body.account_id);
    let filePath = './uploads/' + req.file.filename;
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            if(moment(data[0], "DD/MM/YYYY", true).isValid()) {
                // console.log('Valid date:: ' + moment(data[0], "DD/MM/YYYY").format("YYYY-MM-DD"));
                data[0] = (moment(data[0], "DD/MM/YYYY").format("YYYY-MM-DD"));
                data.push(req.body.account_id);
                console.log(data);
                csvData.push(data);
            } else {
                // console.log('invalid date, ignoring');
            }
            // csvData.push(data);
        })
        .on("end", function () {
            let query = 'INSERT INTO temp_upload (date, description, amount, real_acct) VALUES ?';
            db.query(query, [csvData], (error, response) => {
                console.log(error || response);
            });

            fs.unlinkSync(filePath)

            next({
                status: "success",
                message: "data retreived",
                // data: results
            }, null);
        });

    stream.pipe(csvStream);

};

exports.deleteFile = function(req, res, next) {
    //console.log(req.query);
    var results = db.query("TRUNCATE TABLE temp_upload", function (error, results, fields) {
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

exports.getTempFile = function(req, res, next) {
    var results = db.query("SELECT temp_upload.id, physical_account.name AS real_name, DATE_FORMAT(temp_upload.date, \"%Y-%m-%d\") AS date, temp_upload.description, temp_upload.amount, temp_upload.pot, virtual_account.name FROM temp_upload INNER JOIN virtual_account ON virtual_account.id = temp_upload.pot INNER JOIN physical_account ON physical_account.id = temp_upload.real_acct ORDER BY temp_upload.date DESC", function(error, results, fields) {
        // console.log(results);
        if (error) {
            console.log('error: ' + error);
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

exports.updateTempFile = function(req, res, next) {
    for (const [key, value] of Object.entries(req.body)) {
        // console.log('From controller - key: ' + key + ' value: ' + value);
        let query = "UPDATE temp_upload SET pot ='" + value + "' WHERE id = '" + key + "'";
            db.query(query, (error, response) => {
                console.log(error || response);
            });
    };
    next();
}



exports.deleteTempFileEntries = function(req, res, next) {
    for (const value of req.body.delete_entry) {
        // console.log('From controller - key: ' + key + ' value: ' + value);
        let query = "DELETE FROM temp_upload WHERE id = '" + value + "'";
            db.query(query, (error, response) => {
                console.log(error || response);
            });
    };
    next();
}

exports.getUserByEmail = function(req, res, next) {
    // console.log(req.query);
    var results = db.query("SELECT id FROM user WHERE user.email = " + "'" + req.userContext.userinfo.preferred_username + "'", function (error, results, fields) {
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

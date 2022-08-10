require('dotenv').config();
require('./database');

const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
var okta = require("@okta/okta-sdk-nodejs");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var fs = require('fs');
var csv = require('fast-csv');
var multer = require('multer');



// content and form routes
var indexRouter = require('./routes/index');
var createVirtualAccountRouter = require('./routes/createvirtualaccount');
var createPhysicalAccountRouter = require('./routes/createphysicalaccount');
var createPaymentRouter = require('./routes/createpayment');
var createDepositRouter = require('./routes/createdeposit');
var manageFilesRouter = require('./routes/managefiles');
var deleteFileRouter = require('./routes/deletefile');

// api routes
var usersRouter = require('./routes/api/users');
var userRouter = require('./routes/api/user');
var physicalAccountRouter = require('./routes/api/physicalaccount');
var virtualAccountRouter = require('./routes/api/virtualaccount');
var paymentRouter = require('./routes/api/payment');
var depositRouter = require('./routes/api/deposit');
var transactionRouter = require('./routes/api/transaction');
var transfersToDoRouter = require('./routes/api/transferstodo');
var uploadFileRouter = require('./routes/api/uploadfile');
var deleteFileAPIRouter = require('./routes/api/deletefile');
var manageUploadsAPIRouter = require('./routes/api/manageuploads');
var updateTempUploadRouter = require('./routes/api/updatetempupload');
var updateTransactionLogRouter = require('./routes/api/updatetransactionlog');

const basicAuth = require('express-basic-auth');

var app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './uploads/')
  },
  filename: (req, file, callBack) => {
    callBack(null, file,fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({
  storage: storage
});

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false
}));

var oktaClient = new okta.Client({
  orgUrl: process.env.ORGURL,
  token: process.env.TOKEN
});

const oidc = new ExpressOIDC({
  issuer: process.env.ISSUER,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  appBaseUrl: process.env.APPBASEURL,
  redirect_uri: process.env.REDIRECT_URI,
  scope: 'openid profile'
});

app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }
  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});

// app.use(basicAuth({
//   users: { admin: `${process.env.ADMINPASS}` },
//   challenge: true
// }));

app.use('/', indexRouter);
app.use('/createvirtualaccount', oidc.ensureAuthenticated(), createVirtualAccountRouter);
app.use('/createphysicalaccount', oidc.ensureAuthenticated(), createPhysicalAccountRouter);
app.use('/createPayment', oidc.ensureAuthenticated(), createPaymentRouter);
app.use('/createDeposit', oidc.ensureAuthenticated(), createDepositRouter);
app.use('/managefiles', oidc.ensureAuthenticated(), manageFilesRouter);
app.use('/deletefile', oidc.ensureAuthenticated(), deleteFileRouter);

app.use('/api/users', oidc.ensureAuthenticated(), usersRouter);
app.use('/api/user', userRouter);
app.use('/api/physicalaccount', oidc.ensureAuthenticated(), physicalAccountRouter);
app.use('/api/virtualAccount', oidc.ensureAuthenticated(), virtualAccountRouter);
app.use('/api/payment', oidc.ensureAuthenticated(), paymentRouter);
app.use('/api/deposit', oidc.ensureAuthenticated(), depositRouter);
app.use('/api/transaction', oidc.ensureAuthenticated(), transactionRouter);
app.use('/api/transferstodo', oidc.ensureAuthenticated(), transfersToDoRouter);
app.use('/api/uploadfile', oidc.ensureAuthenticated(), uploadFileRouter);
app.use('/api/deletefile', oidc.ensureAuthenticated(), deleteFileAPIRouter);
app.use('/api/manageuploads', oidc.ensureAuthenticated(), manageUploadsAPIRouter);
app.use('/api/updatetempupload', oidc.ensureAuthenticated(), updateTempUploadRouter);
app.use('/api/updatetransactionlog', oidc.ensureAuthenticated(), updateTransactionLogRouter);

// app.use('/registration', registrationRouter);
// app.use('/create', registrationRouter);
// app.use('/product', productRouter);
// app.use('/productlist', productlistRouter);
// app.use('/delete', usersRouter);
// app.use('/deleteproduct', oidc.ensureAuthenticated(), productlistRouter);
// app.use('/manualrace', manualraceRouter);
// app.use('/myprofile', oidc.ensureAuthenticated(), myprofileRouter);

app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
  res.send(JSON.stringify(req.userContext.userinfo));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;

// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var crypto   = require('crypto');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// routes ======================================================================
var mainRouter    = require('./app/routes/mainRoutes.js')(passport, crypto); // load our routes and pass in our app and fully configured passport
var authRouter    = require('./app/routes/authRoutes.js')(passport, crypto);
var connectRouter = require('./app/routes/connectRoutes.js')(passport, crypto);
var unlinkRouter  = require('./app/routes/unlinkRoutes.js')();
var testRouter    = require('./app/routes/trialRoutes.js')();

app.use('/',        mainRouter);
app.use('/auth',    authRouter);
app.use('/connect', connectRouter);
app.use('/unlink',  unlinkRouter);
app.use('/test',    testRouter);
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
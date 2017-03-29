// server.js

// set up ======================================================================
// get all the tools we need
var express      = require('express');
var app          = express();
var port         = process.env.PORT || 8080;

var mongoose     = require('mongoose');
var passport     = require('passport');
var connectRoles = require('connect-roles');
var flash        = require('connect-flash');
var https        = require('https');
var crypto       = require('crypto');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport);  // pass passport for configuration

var user = new connectRoles({
  failureHandler: function (req, res, action) {
    res.send('Access Denied - You don\'t have permission to do that');
  }
});

var connectRolesUser = require('./config/roles')(user); // pass connect-roles for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch', placesIds: [], places: []})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(connectRolesUser.middleware());
// routes ======================================================================


var mainRouter    = require('./app/routes/mainRoutes.js')(express, passport, crypto, connectRolesUser); // load our routes and pass in our app and fully configured passport
var authRouter    = require('./app/routes/authRoutes.js')(express, passport, crypto);
var connectRouter = require('./app/routes/connectRoutes.js')(express, passport, crypto);
var unlinkRouter  = require('./app/routes/unlinkRoutes.js')(express);

var placesRouter  = require('./app/routes/placesRoutes.js')(express, https);
var racesRouter   = require('./app/routes/raceRoutes')(express, connectRolesUser);
var usersRouter   = require('./app/routes/userRoutes')(express, racesRouter);

var barsRouter    = require('./app/routes/barRoutes')(express);

var testRouter    = require('./app/routes/trialRoutes.js')(express, connectRolesUser);

app.use('/',        mainRouter);
app.use('/auth',    authRouter);
app.use('/connect', connectRouter);
app.use('/unlink',  unlinkRouter);

app.use('/places',  placesRouter);
app.use('/races',   racesRouter);
app.use('/users',   usersRouter);

app.use('/bars',    barsRouter);
app.use('/test',    testRouter);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
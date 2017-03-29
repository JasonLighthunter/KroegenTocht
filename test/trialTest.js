var request      = require('supertest');
var expect       = require('chai').expect;
var should       = require('chai').should();
var crypto       = require('crypto');
var connectRoles = require('connect-roles');
var passport     = require('passport');
var https        = require('https');

require('../config/passport')(passport);  // pass passport for configuration

var user = new connectRoles({
  failureHandler: function (req, res, action) {
    res.send('Access Denied - You don\'t have permission to do that');
  }
});

var connectRolesUser = require('../config/roles')(user); // pass connect-roles for configuration

var express    = require('express');
var app        = express();

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

var mainRouter    = require('../app/routes/mainRoutes.js')(express, passport, crypto, connectRolesUser); // load our routes and pass in our app and fully configured passport
var authRouter    = require('../app/routes/authRoutes.js')(express, passport, crypto);
var connectRouter = require('../app/routes/connectRoutes.js')(express, passport, crypto);
var unlinkRouter  = require('../app/routes/unlinkRoutes.js')(express);
var testRouter = require('../app/routes/trialRoutes')(express, connectRolesUser);
var placesRouter  = require('../app/routes/placesRoutes.js')(express, https);
var racesRouter   = require('../app/routes/raceRoutes')(express, connectRolesUser);
var usersRouter   = require('../app/routes/userRoutes')(express, racesRouter);
var barsRouter    = require('../app/routes/barRoutes')(express);

app.use('/test', testRouter);

function makeRequest(route, statusCode, done) {
  request(app)
    .get(route)
    .expect(statusCode)
    .end(function(err, res) {
      if(err){ 
        return done(err);
      }

      done(null, res);
  });
}

describe('Testing trial route', function() {
  describe('without params', function() {
    it('should not fail', function(done) {
      makeRequest('/test', 200, function(err, res) {
        if(err) {
          return done(err);
        }

        expect(res.text).to.not.be.undefined;
        expect(res.text).to.equal('root');
        done();
      });
    });
  });

  describe('with valid params', function() {
    it('should return the string test1 on route: /test/test1', function(done) {
      var expectedString = 'test1';

      makeRequest('/test/test1', 200, function(err, res) {
        if(err) {
          return done(err);
        }

        expect(res.text).to.not.be.undefined;
        expect(res.text).to.equal(expectedString);
        done();
      });
    });

    it('should return the string test2 on route: /test/test2', function(done) {
      var expectedString = 'test2';

      makeRequest('/test/test2', 200, function(err, res) {
        if(err) {
          return done(err);
        }

        expect(res.text).to.not.be.undefined;
        expect(res.text).to.equal(expectedString);
        done();
      });
    });

  });
});
var request  = require('supertest');
var expect   = require('chai').expect;
var should   = require('chai').should();

var express    = require('express');
var app        = express();
var testRouter = require('../app/routes/trialRoutes')(express);

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
var request  = require('supertest');
var expect   = require('chai').expect;
var should   = require('chai').should();

var app       = require('express')();
var testRouter = require('../app/routes/trialRoutes');

app.use('/test', testRouter);

function makeRequest(route, statusCode, done) {
  console.log(route);
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
  describe('without params', function(){
    it('should not fail', function(done) {
      makeRequest('/test', 200, function(err, res) {
        if(err) {
          return done(err);
        }

        // expect(res.body).to.not.be.undefined;
        // expect(res.body).to.equal('root');
        done();
      });
    });
    // it('should return the string root', function(done) {
    //   makeRequest('/test', 200, function(err, res){
    //     if(err){ return done(err); }
    //     console.log(res.body);

    //     expect(res.body).to.not.be.undefined;
    //     expect(res.body).to.equal('root');
    //     done();
    //   });
    // });
  });

  describe('with valid params', function() {
    it('should return the string test1 on route: /test1', function(done) {
      var expectedString = 'test1';

      makeRequest('/test/test1', 200, function(err, res) {
        if(err) {
          return done(err);
        }

        expect(res.body).to.not.be.undefined;
        expect(res.body).to.equal(expectedString);
        done();
      });
    });

    it('should return the string test2 on route: /test2', function(done) {
      var expectedString = 'test2';

      makeRequest('/test/test2', 200, function(err, res) {
        if(err) {
          return done(err);
        }

        expect(res.body).to.not.be.undefined;
        expect(res.body).to.equal(expectedString);
        done();
      });
    });

  });

  describe('with invalid params', function() {
    it('should return 400 when date is invalid', function(done){
      makeRequest('/35/2/2000', 400, done);
    });

    it('should return 400 when date is not numeric', function(done){
      makeRequest('/test/me/now', 400, done);
    });
  });
});
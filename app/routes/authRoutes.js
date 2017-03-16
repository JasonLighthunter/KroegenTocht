var express = require('express');
var router  = express.Router();

module.exports = function(passport, crypto) {
  // =====================================
  // Google ROUTES =======================
  // =====================================
  router.get('/google', 
    passport.authenticate('google', {
      scope : ['profile', 'email'] 
    })
  );

  router.get('/google/callback', 
    passport.authenticate('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    })
  );
  // =====================================
  // REDDIT ROUTES =======================
  // =====================================
  router.get('/reddit', function(req, res, next) {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
      state    : req.session.state,
      duration : 'permanent'
    })(req, res, next);
  });

  router.get('/reddit/callback', function(req, res, next){
    passport.authenticate('reddit', {
      successRedirect : '/profile',
      failureRedirect : '/'
    })(req, res, next);
  });

  return router;
};
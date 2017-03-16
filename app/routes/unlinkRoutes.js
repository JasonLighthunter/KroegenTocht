var express = require('express');
var router  = express.Router();

module.exports = function() {
  router.get('/local', function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

    // google ---------------------------------
  router.get('/google', function(req, res) {
    var user          = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  router.get('/reddit', function(req, res) {
    var user          = req.user;
    user.reddit.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  return router;
};
module.exports = function(express, passport, crypto) {

  var router = express.Router();

  // google ---------------------------------
  // send to google to do the authentication
  router.get('/google', 
    passport.authorize('google', { 
      scope : ['profile', 'email'] 
    })
  );

  // the callback after google has authorized the user
  router.get('/google/callback',
    passport.authorize('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }
  ));

  // reddit ---------------------------------
  // send to reddit to do authorization
  router.get('/reddit', function(req, res, next) {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
      state    : req.session.state,
      duration : 'permanent',
    })(req, res, next);
  });

  router.get('/reddit/callback', function(req, res, next) {
    passport.authenticate('reddit', {
      successRedirect : '/profile',
      failureRedirect : '/'
    })(req, res, next);
  });

  return router;
};
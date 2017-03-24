module.exports = function(express, passport, crypto, user) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('index.ejs');
  });

  router.get('/profile', isLoggedIn, function(req, res) {
    res.redirect('/users/' + req.user.id);
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { 
      message : req.flash('loginMessage') 
    });
  });

  router.post('/login',
    passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login',   // redirect back to the signup page if there is an error
      failureFlash    : true        // allow flash messages
    })
  );

  router.get('/signup', function(req, res) {
    res.render('signup.ejs', { 
      message: req.flash('signupMessage') 
    });
  });

  // process the signup form
  router.post('/signup', 
    passport.authenticate('local-signup', {
      successRedirect : '/signup-success', // redirect to the secure profile section
      failureRedirect : '/signup',  // redirect back to the signup page if there is an error
      failureFlash    : true        // allow flash messages
    })
  );

  router.get('/signup-success', function(req, res) {
    req.logout();
    res.render('signupSuccess.ejs');
  });

  return router;
};

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/');
}

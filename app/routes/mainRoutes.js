module.exports = function(express, passport, crypto, user) {
  var router = express.Router();

  /**
   * @swagger
   * /:
   *   get:
   *     tags:
   *       - Main
   *     description: displays the home page
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: home page
   */
  router.get('/', function(req, res) {
    res.render('index.ejs');
  });

  /**
   * @swagger
   * /profile:
   *   get:
   *     tags:
   *       - Main
   *     description: displays the profile page of the logged in user
   *     produces:
   *       - text/html
   *     responses:
   *       isLoggedIn:
   *         description: profile page
   *       default:
   *         description: home page
   */
  router.get('/profile', isLoggedIn, function(req, res) {
    res.redirect('/users/' + req.user.id);
  });

  /**
   * @swagger
   * /logout:
   *   get:
   *     tags:
   *       - Main
   *     description: logs out the user and redirects to the home page
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: home page
   */
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  /**
   * @swagger
   * /login:
   *   get:
   *     tags:
   *       - Main
   *     description: displays the login page
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: login page
   */
  router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { 
      message : req.flash('loginMessage') 
    });
  });

  /**
   * @swagger
   * /login:
   *   post:
   *     tags:
   *       - Main
   *     description: tries to log the user in
   *     produces:
   *       - text/html
   *     responses:
   *       succes:
   *         description: profile page
   *       default:
   *         description: login page
   */
  router.post('/login',
    passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login',   // redirect back to the signup page if there is an error
      failureFlash    : true        // allow flash messages
    })
  );

  /**
   * @swagger
   * /signup:
   *   get:
   *     tags:
   *       - Main
   *     description: display user creation page
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: signup page
   */
  router.get('/signup', function(req, res) {
    res.render('signup.ejs', { 
      message: req.flash('signupMessage') 
    });
  });

  // process the signup form
  /**
   * @swagger
   * /signup:
   *   post:
   *     tags:
   *       - Main
   *     description: create a new user
   *     produces:
   *       - text/html
   *     responses:
   *       succes:
   *         description: signup succes page
   *       failure:
   *         description: signup page
   */
  router.post('/signup',
    passport.authenticate('local-signup', {
      successRedirect : '/signup-success', // redirect to the secure profile section
      failureRedirect : '/signup',  // redirect back to the signup page if there is an error
      failureFlash    : true        // allow flash messages
    })
  );

  /**
   * @swagger
   * /signup-succes:
   *   get:
   *     tags:
   *       - Main
   *     description: displays the succes of the signup
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: signup succes page
   */
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

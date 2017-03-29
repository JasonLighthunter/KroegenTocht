module.exports = function(express, passport, crypto) {

  var router = express.Router();

  // =====================================
  // Google ROUTES =======================
  // =====================================
  /**
   * @swagger
   * /auth/google:
   *   get:
   *     tags:
   *       - Social
   *     description: Authenticate via Google OAuth
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: redirect to "/auth/google/callback"
   */
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
  /**
   * @swagger
   * /auth/reddit:
   *   get:
   *     tags:
   *       - Social
   *     description: Authenticate via Reddit OAuth
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: redirect to "/auth/reddit/callback"
   */
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
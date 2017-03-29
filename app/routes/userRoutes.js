module.exports = function(express, racesRouter) {

  var router = express.Router();

  /**
   * @swagger
   * /user:
   *   get:
   *     tags:
   *       - User
   *     description: visit you profile page
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: redirect to "/profile"
   */
  router.get('/', function(req, res) {
    res.redirect('/profile');
  });

  /**
   * @swagger
   * /user/{user_id}:
   *   get:
   *     tags:
   *       - User
   *     description: visit profile page
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: redirect to "/profile"
   */
  router.get('/:userId', function(req, res) {
    if(req.params.userId === req.user.id) {
      res.render('profile.ejs');
    } else {
      res.redirect('/profile');
    }
  });

  router.use('/', isLoggedIn);

  /**
   * @swagger
   * /user/{user_id}/races:
   *   get:
   *     tags:
   *       - User
   *       - Races
   *     description: show races pages for user
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: display all races for user
   */
  router.use('/:userId/races', racesRouter);

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

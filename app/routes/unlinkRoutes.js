module.exports = function(express) {

  var router = express.Router();

  /**
   * @swagger
   * /unlink/google:
   *   get:
   *     tags:
   *       - Social
   *     description: unlink local user from google OAuth
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: redirect to "/profile"
   */
  router.get('/google', function(req, res) {
    var user          = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  /**
   * @swagger
   * /unlink/reddit:
   *   get:
   *     tags:
   *       - Social
   *     description: unlink local user from reddit OAuth
   *     produces:
   *       - text/html
   *     responses:
   *       default:
   *         description: redirect to "/profile"
   */
  router.get('/reddit', function(req, res) {
    var user          = req.user;
    user.reddit.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  return router;
};
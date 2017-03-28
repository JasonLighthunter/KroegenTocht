module.exports = function(express, racesRouter) {

  var router = express.Router();

  router.get('/', function(req, res) {
    res.redirect('/profile');
  });

  router.get('/:userId', function(req, res) {
    if(req.params.userId === req.user.id) {
      res.render('profile.ejs');
    } else {
      res.redirect('/profile');
    }
  });

  router.use('/', isLoggedIn);
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

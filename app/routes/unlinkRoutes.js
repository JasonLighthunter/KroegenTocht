module.exports = function(express) {

  var router = express.Router();

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
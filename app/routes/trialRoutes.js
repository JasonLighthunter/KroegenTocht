module.exports = function(express, user) {

  var router = express.Router();

  router.get('/', function(req, res) {
    console.log('rootTest');
    var toReturn = 'root';
    res.send('root');
  });

  router.get('/test1', function(req, res) {
    var toReturn = 'test1';
    res.send(toReturn);
  });

  router.get('/test2', function(req, res) {
    var toReturn = 'test2';
    res.send(toReturn);
  });

  router.get('/secret', user.can('see secret page'), function(req, res) {
    var toReturn = 'illuminati is real!!!1!!';
    res.send(toReturn);
  });

  return router;
};

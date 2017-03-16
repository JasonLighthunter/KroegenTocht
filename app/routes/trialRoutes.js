module.exports = function(express) {

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

  return router;
};

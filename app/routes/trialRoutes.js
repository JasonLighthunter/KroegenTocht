module.exports = function(express, user) {

  var router = express.Router();

  /**
   * @swagger
   *   Puppy:
   *     properties:
   *       name:
   *         type: string
   *       breed:
   *         type: string
   *       age:
   *         type: integer
   *       sex:
   *         type: string
   */

  /**
   * @swagger
   * /test/:
   *   get:
   *     tags:
   *       - test
   *     description: Returns the string containing "root";
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of puppies
   *         schema:
   *           $ref: '#/definitions/Puppy'
   */
  router.get('/', function(req, res) {
    console.log('rootTest');
    var toReturn = 'root';
    res.send('root');
  });

  /**
   * @swagger
   * /test/test1:
   *   get:
   *     tags:
   *       - test
   *     description: Returns the string containing "root";
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of puppies
   *         schema:
   *           $ref: '#/definitions/Puppy'
   */
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

  router.get('/testplaces', function(req, res) {
    var data = req.session.places;
    res.send(data);
  });

  return router;
};

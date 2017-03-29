var User = require('../models/user');
var Race = require('../models/race');

module.exports = function(express, user) {

  var router = express.Router({ mergeParams: true });

  /**
   * @swagger
   * definition:
   *   Race:
   *    properties:
   *      testString:
   *        type: string
   *      boolean:
   *        type: boolean
   *      age:
   *        type: int
   *
   */

  /**
   * @swagger
   * /races:
   *   get:
   *     tags:
   *       - Races
   *     description: Gets all races from the database and returns them as a json array
   *     parameters:
   *     - name: name
   *       in: query
   *       description: name of race
   *       required: false
   *       type: string
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of races
   *         schema:
   *           $ref: '#/definitions/Race'
   */
  router.get('/', function(req, res, next) {
    if (req.params.userId) {
      next('route');
    } else {
      next();
    }
  }, function(req, res, next) {

    var searchResult = Race.find();
    if(req.query.name) {
      searchResult = searchResult.byName(req.query.name);
    }

    if(req.query.active!==undefined){
      searchResult = searchResult.byActive(req.query.active);
    }

    searchResult.exec(function(err, races){
      res.json(races); 
    });
  });

  router.get('/', user.can('access private race(s)'), function(req, res, next) {
    var searchResult = User.findById(req.params.userId)
                           .populate('races');

    if(req.query.name){
      searchResult = searchResult.byName(req.query.name)
    }

    searchResult.exec(function(err, user) {
      res.json(user.races);
    });
  });

  //if he parameter userId is set handle the second route,
  /**
   * @swagger
   * /races/{race_id}:
   *   get:
   *     tags:
   *       - Races
   *     description: Gets all races from  a specific user from the database and returns them as a json array
   *     parameters:
   *     - name: race_id
   *       in: path
   *       description: id of race
   *       required: true
   *       type: string
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of races
   *         schema:
   *           $ref: '#/definitions/Race'
   */
  router.get('/:raceId', function(req, res, next) {
    if (req.params.userId) {
      next('route');
    } else {
      next();
    }
  }, function(req, res, next) {
    Race.findById(req.params.raceId, function(err, race) {
      res.json(race);
    });
  });

  router.get('/:raceId', user.can('access private race(s)'), function(req, res, next) {
    var searchResult = User.findById(req.params.userId)
                           .populate('races');

    searchResult.exec(function(err, user) {
      var race = _.findWhere(user.races, {id : req.params.raceId });
      console.log(race);
      res.json(race);
    });
  });

  return router;
};
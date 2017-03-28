var User = require('../models/user');
var Race = require('../models/race');

module.exports = function(express, user) {

  var router = express.Router({ mergeParams: true });

  router.get('/', function(req, res, next) {
    if (req.params.userId) {
      next('route');
    } else {
      next();
    }
  }, function(req, res, next) {
    Race.find(function(err, races) {
      res.json(races); 
    });
  });

  router.get('/', user.can('access private race(s)'), function(req, res, next) {
    var searchResult = User.findById(req.params.userId)
                           .populate('races');

    searchResult.exec(function(err, user) {
      res.json(user.races);
    });
  });

  //if he parameter userId is set handle the second route,
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
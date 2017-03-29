var Bar = require('../models/bar');

module.exports = function(express) {

  var router = express.Router();

  router.get('/', function(req, res, next) {
    Bar.find(function(err, bars) {
      res.json(bars);
    });
  });

  //if he parameter userId is set handle the second route,
  router.get('/:barId', function(req, res, next) {
    Bar.findById(req.params.barId, function(err, bar) {
      res.json(bar);
    });
  });

  router.post('/', function(req, res) {
    var conditions = { name : req.body.name };
    Bar.findOne(conditions, function(err, bar) {
      console.log(err);
      console.log(bar);
      if(err) {
        throw err;
      } 
      if(bar) {
        console.log(bar);
        bar.name = req.body.name;
        bar.save(function(err) {
          if(err){ 
            throw err;
          } else {
            res.status(201);
            res.json(savedBar);
          }
        });
      } else {
        var newBar = new Bar(req.body);
        newBar.save(function(err, savedBar){
          if(err){ 
            throw err;
          } else {
            res.status(201);
            res.json(savedBar);
          }
        });
      }
    });
  });

  router.delete('/:barId', function(req, res) {
    Bar.findByIdAndRemove(req.params.barId, function(err) {
      if (err) {
        throw err;
      } else {
        res.json({ message: 'Bar Deleted!'});
      }
    });
  });


  return router;
};
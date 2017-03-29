var Bar = require('../models/bar');

module.exports = function(express) {

  var router = express.Router();

  /**
   * @swagger
   * definition:
   *   Bar:
   *    properties:
   *      name:
   *        type: string
   *      place_id:
   *        type: string
   */

  /**
   * @swagger
   * /bars:
   *   get:
   *     tags:
   *       - Bars
   *     description: Gets all bars from the database and returns them as a json array
   *     parameters:
   *     - name: name
   *       in: query
   *       description: name of bar
   *       required: false
   *       type: string
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of bars
   *         schema:
   *           $ref: '#/definitions/Bar'
   */
  router.get('/', function(req, res, next) {
    var searchResult = Bar.find();

    if(req.query.name){
      searchResult = searchResult.byName(req.query.name);
    }

    searchResult.exec(function(err, bars) {
      res.json(bars);
    });
  });

  /**
   * @swagger
   * /bars/{bar_id}:
   *   get:
   *     tags:
   *       - Bars
   *     description: Gets bar from database where Id is the given id.
   *     parameters:
   *     - name: bar_id
   *       in: path
   *       description: id of bar
   *       required: true
   *       type: string
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A bar
   *         schema:
   *           $ref: '#/definitions/Bar'
   */
  //if he parameter userId is set handle the second route,
  router.get('/:barId', function(req, res, next) {
    Bar.findById(req.params.barId, function(err, bar) {
      res.json(bar);
    });
  });

  /**
   * @swagger
   * /bars:
   *   put:
   *     tags:
   *       - Bars
   *     description: adds bar to database
   *     parameters:
   *     - name: name
   *       in: post
   *       description: name of bar
   *       required: true
   *       type: string
   *     - name: place_id
   *       in: post
   *       description: place_id of bar for Google places
   *       required: true
   *       type: string
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: An array of bars
   *         schema:
   *           $ref: '#/definitions/Bar'
   *       failure:
   *         description: throws error
   */
  router.put('/:barId', function(req, res) {
    Bar.findById(req.params.barId, function(err, bar) {
      console.log(err);
      console.log(bar);
      if(err) {
        throw err;
      } 
      if(bar) {
        console.log(bar);
        bar.name = req.body.name;
        bar._id = req.body.place_Id;
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

  /**
   * @swagger
   * /bars:
   *   delete:
   *     tags:
   *       - Bars
   *     description: adds bar to database
   *     parameters:
   *     - name: bar_id
   *       in: path
   *       description: id of bar
   *       required: true
   *       type: string
   *     produces:
   *       - application/json
   *     responses:
   *       succes:
   *         description: Bar Deleted
   *       failure:
   *         description: throws error
   */
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
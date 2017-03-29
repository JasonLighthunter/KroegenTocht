const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const APIKEY = "&key=AIzaSyC2PCxu3pWmK_jzWE9uyjxCFyuWU9WK3CM";

var _ = require('underscore');

//testgegevens
//location=51.6897829,5.2620178
//longitude = 51.6897829
//latitude = 5.2620178

function getNearbyBars(longitude, latitude, radius, type, https, req) {

  console.log("Sending request with the folowing parameters: (location=" + longitude + "," + latitude + "&radius=" + radius + "&type=" + type + ").");

  return new Promise(function(resolve, reject) {
    https.get(BASE_URL + "?location=" + longitude + "," + latitude + "&radius=" + radius + "&type=" + type + APIKEY, function(response) {


      var responseBody = "";  // will hold the response body as it comes

      // join the data chuncks as they come
      response.on('data', function(chunck) { responseBody += chunck });


      response.on('end', function() {
        console.log("parsing results to JSON");
        var jsonResponse = JSON.parse(responseBody);

        console.log("Status:" +jsonResponse.status)

        console.log("storing data to database");


        jsonResponse.results.forEach(function (res) {
          //checking if data doesn't already exist
          if(!(_.contains(req.session.placesIds, res.id))){
            req.session.places.push(res);
            req.session.placesIds.push(res.id);
          }
        });

        if(jsonResponse.next_page_token) {
          setTimeout(
            function() {
              nextGooglePlacesHttpsRequest(jsonResponse.next_page_token, https, req)
                .then(function () {
                  resolve();
                })
            }, 2000);
        }
        else {
          resolve();
        }
      });
    })
  });

  //return deferred.promise;
}

function nextGooglePlacesHttpsRequest(nextPageToken, https, req) {


  return new Promise(function(resolve, reject) {
    https.get(BASE_URL + "?pagetoken=" + nextPageToken + APIKEY, function(response) {

      var responseBody = "";  // will hold the response body as it comes

      // join the data chuncks as they come
      response.on('data', function(chunck) { responseBody += chunck });

      response.on('end', function() {

        console.log("parsing results to JSON");
        var jsonResponse = JSON.parse(responseBody);

        console.log("storing data to database");

        jsonResponse.results.forEach(function (res) {
          //checking if data doesn't already exist
          if(!(_.contains(req.session.placesIds, res.id))){
            req.session.places.push(res);
            req.session.placesIds.push(res.id);
          }
        });

        if(jsonResponse.next_page_token) {
          setTimeout(
            function() {
              nextGooglePlacesHttpsRequest(jsonResponse.next_page_token, https, req)
                .then(function () {
                  resolve();
                })
            }, 2000);
        }
        else {
          resolve();
        }
      });
    });
  });

}

module.exports = function(express, https) {

  var router = express.Router();

  //Middleware function to log request protocol
  router.use('/', function (req, res, next) {
    console.log("A request for locations received at " + Date.now());
    next();
  });

  /**
   * @swagger
   * definition:
   *   Bar:
   *    properties:
   *      icon:
   *        type: string
   *      id:
   *        type: string
   *      name:
   *        type: string
   *      place_id:
   *        type: string
   *      reference:
   *        type: string
   *      scope:
   *        type: string
   *      vicinity:
   *        type: string
   *      types:
   *        type: [string]
   *      alt_ids:
   *        type: [string]
   *      photos:
   *        type: [string]
   *      opening_hours:
   *        open_now:
   *          type: bool
   *      geometry:
   *        location:
   *          lat: float
   *          lng: float
   *      __v:
   *        type: int
   */

  /**
   * @swagger
   * /places:
   *   get:
   *     tags:
   *       - Places
   *     description: Gets the 60 nearest bars within a radius of 5 kilometer form the google places API and returns them as a json array
   *     parameters:
   *     - name: longitude
   *       in: query
   *       description: longitude of search center
   *       required: true
   *       type: number
   *       format: float
   *     - name: latitude
   *       in: query
   *       description: latitude of search center
   *       required: true
   *       type: number
   *       format: float
   *     - name: radius
   *       in: query
   *       description: search radius in meters
   *       required: false
   *       type: integer
   *       format: int32
   *     - name: type
   *       in: query
   *       description: target of search
   *       required: false
   *       type: integer
   *       format: int32
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of bars
   *         schema:
   *           $ref: '#/definitions/Bar'
   */
  //for location
  router.get('/', function (req, res) {

    if(req.query.longitude && req.query.latitude) {


      var radius = 5000;
      if(req.query.radius){
        radius = req.query.radius
      }
      var type = "bar";
      if(req.query.type){
        radius = req.query.type
      }

      if (!req.session.places) {
        req.session.places = [];
      }
      if (!req.session.placesIds) {
        req.session.placesIds = [];
      }
      getNearbyBars(req.query.longitude, req.query.latitude, radius, type, https, req).then(function () {
        res.json(req.session.places)
      });
    } else {
      res.json({
        Status: "Failure",
        Message: "The required parameters longitude and latitude were not given."
      });
    }
  });

  return router;
};
const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const BASE_URI  = "&radius=5000&type=bar";
const APIKEY = "&key=AIzaSyC2PCxu3pWmK_jzWE9uyjxCFyuWU9WK3CM";

var _ = require('underscore');

//testgegevens
//location=51.6897829,5.2620178
//longitude = 51.6897829
//latitude = 5.2620178

function getNearbyBars(longitude, latitude, https, req) {

  var deferred = Promise.defer();

  https.get(BASE_URL + "?location=" + longitude + "," + latitude + BASE_URI + APIKEY, function(response) {


    var responseBody = "";  // will hold the response body as it comes

    // join the data chuncks as they come
    response.on('data', function(chunck) { responseBody += chunck });


    response.on('end', function() {
      console.log("parsing results to JSON");
      var jsonResponse = JSON.parse(responseBody);

      console.log("Status:" +jsonResponse.status)

      console.log("storing data to database");

      console.log(req.session.places[0]);
      console.log(jsonResponse.results[0]);

      jsonResponse.results.forEach(function (res) {
        //checking if data doesn't already exist
        if(!(_.contains(req.session.placesIds, res.id))){
          req.session.places.push(res);
          req.session.placesIds.push(res.id);
          console.log("session");
        } else{
          console.log("no session");
        }
      });

      if(jsonResponse.next_page_token) {
        setTimeout(
        function() {
          nextGooglePlacesHttpsRequest(jsonResponse.next_page_token, https, req)
            .then(function () {
              deferred.resolve();
            })
        }, 1500);
      }
      else {
        deferred.resolve();
      }
    });
  })

  return deferred.promise;
}

function nextGooglePlacesHttpsRequest(nextPageToken, https, req) {

  var deferred = Promise.defer();

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
          console.log("session");
        } else{
          console.log("no session");
        }
      });

      if(jsonResponse.next_page_token) {
        setTimeout(
          function() {
            nextGooglePlacesHttpsRequest(jsonResponse.next_page_token, https, req)
              .then(function () {
                deferred.resolve();
              })
          }, 1500);
      }
      else {
        deferred.resolve();
      }
    });
  });

  return deferred.promise;
}

module.exports = function(express, https) {

  var router = express.Router();

  //Middleware function to log request protocol
  router.use('/', function (req, res, next) {
    console.log("A request for locations received at " + Date.now());
    next();
  });

  router.use('/getbars', function (req, res, next) {
    console.log("requesting bars");
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
   * /places/getbars/longitude/latitude:
   *   get:
   *     tags:
   *       - Places
   *     description: Gets the 60 nearest bars within a radius of 5 kilometer form the google places API and returns them as a json array
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of bars
   *         schema:
   *           $ref: '#/definitions/Bar'
   */
  //for location
  router.get('/getbars/:longitude/:latitude', function (req, res) {
    console.log(req.params.longitude);
    console.log(req.params.latitude);
    console.log("starting https request function.");
    if(!req.session.places){
      req.session.places = [];
    }
    if(!req.session.placesIds){
      req.session.placesIds = [];
    }
    getNearbyBars(req.params.longitude, req.params.latitude, https, req).then(function(){res.json(req.session.places)});
  });

  return router;
};
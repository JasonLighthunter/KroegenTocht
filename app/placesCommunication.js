/**
 * Created by steve_000 on 16-Mar-17.
 */
var mongoose = require('mongoose');
Place = mongoose.model("Place");

const BASE_HOST = "maps.googleapis.com";
const BASE_PATH = "/maps/api/place/nearbysearch/json";
const BASE_URI = "&radius=5000&type=bar&key=AIzaSyC2PCxu3pWmK_jzWE9uyjxCFyuWU9WK3CM";

//location=51.6897829,5.2620178&radius=5000&type=bar

module.exports = function(app, https) {

  function getNearbyBars(longitude, lattitude) {

    var options = {
      host: BASE_HOST,
      path: BASE_PATH + "?location=" + longitude + "," + lattitude + BASE_URI,
      method: 'GET'
    };

    // console.log("logging https request URL:");
    // console.log(options);

    //callback method that reads the input and saves it to the database;
    callback = function (response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, save it to the database
      response.on('end', function () {

        console.log("parsing results to JSON");
        var resultsJson = JSON.parse(str);
        console.log("storing data to database");
        resultsJson.results.forEach(function (result) {

          //checking if data doesn't already exist
          Place.find({place_id : result.place_id}, function (err, docs) {
            if (docs.length){
              console.log('Name exists already');
            }else{
              new Place(result).save();
            }
          });
        });
      });
    };
  https.request(options, callback).end();
}

  //Middleware function to log request protocol
  app.use('/locations', function (req, res, next) {
    console.log("A request for locations received at " + Date.now());
    next();
  });

  app.use('/locations/getbars', function (req, res, next) {
    console.log("requesting bars");
    next();
  });

  //for location
  app.get('/locations/getbars/:longitude/:latitude', function (req, res) {
    console.log(req.params.longitude);
    console.log(req.params.latitude);
    console.log("starting https request function.");
    getNearbyBars(req.params.longitude, req.params.latitude);
    console.log("post request");
  });
}
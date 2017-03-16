var mongoose = require('mongoose');
Place        = mongoose.model("Place");

const BASE_HOST = "maps.googleapis.com";
const BASE_PATH = "/maps/api/place/nearbysearch/json";
const BASE_URI  = "&radius=5000&type=bar&key=AIzaSyC2PCxu3pWmK_jzWE9uyjxCFyuWU9WK3CM";

//location=51.6897829,5.2620178&radius=5000&type=bar

function getNearbyBars(longitude, latitude, https) {
  var options = {
    host   : BASE_HOST,
    path   : BASE_PATH + "?location=" + longitude + "," + latitude + BASE_URI,
    method : 'GET'
  };

  // console.log("logging https request URL:");
  // console.log(options);

  //callback method that reads the input and saves it to the database;
  callback = function (res) {
    var resultString = '';

    //another chunk of data has been recieved, so append it to `resultString`
    res.on('data', function (chunk) {
      resultString += chunk;
    });

    //the whole response has been recieved, save it to the database
    res.on('end', function () {

      console.log("parsing results to JSON");
      var resultsJson = JSON.parse(resultString);
      console.log("storing data to database");
      resultsJson.results.forEach(function (res) {

        //checking if data doesn't already exist
        Place.find({place_id : res.place_id}, function (err, documents) {
          if (documents.length > 0) {
            console.log('Name exists already');
          } else {
            new Place(res).save();
          }
        });
      });
    });
  };
  https.request(options, callback).end();
}

module.exports = function(express, https) {
  //Middleware function to log request protocol
  express.use('/locations', function (req, res, next) {
    console.log("A request for locations received at " + Date.now());
    next();
  });

  express.use('/locations/getbars', function (req, res, next) {
    console.log("requesting bars");
    next();
  });

  //for location
  express.get('/locations/getbars/:longitude/:latitude', function (req, res) {
    console.log(req.params.longitude);
    console.log(req.params.latitude);
    console.log("starting https request function.");
    getNearbyBars(req.params.longitude, req.params.latitude, https);
    console.log("post request");
  });
};
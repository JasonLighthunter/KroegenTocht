/**
 * Created by steve_000 on 16-Mar-17.
 */

const BASE_HOST = "maps.googleapis.com";
const BASE_PATH = "/maps/api/place/nearbysearch/json";
//location=51.6897829,5.2620178&radius=5000&type=bar
module.exports = function(app, https) {

  function getNearbyBars(longtitude, lattitude) {

    var options = {
      host: BASE_HOST,
      path: BASE_PATH + "?location=" + longtitude + "," + lattitude + "&radius=5000&type=bar&key=AIzaSyC2PCxu3pWmK_jzWE9uyjxCFyuWU9WK3CM",
      method: 'GET'
    };

    console.log("logging https request URL:");
    console.log(options);
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.6897829,5.2620178&radius=5000&type=bar&key=AIzaSyC2PCxu3pWmK_jzWE9uyjxCFyuWU9WK3CM

    callback = function (response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        console.log(str);
      });
    };

    https.request(options, callback).end();
  }

//Middleware function to log request protocol
//   app.use('/locations', function (req, res, next) {
//     console.log("A request for things received at " + Date.now());
//     next();
//   });

  app.get('/tests', function(req, res){
    res.send("string");
  });

  app.get('/locations/:longtitude/:latitude', function (req, res) {
    console.log(req.params.longtitude);
    console.log(req.params.latitude);
    console.log("starting https request function.");
    getNearbyBars(req.params.longtitude, req.params.latitude);
    console.log("post request");
  });
}
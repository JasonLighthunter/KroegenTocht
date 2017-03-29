var mongoose = require('mongoose');

console.log('Initializing places schema');

// define the schema for our user model
var barSchema = mongoose.Schema({
  name : String
});

// create the model for races and expose it to our app
module.exports = mongoose.model('Bar', barSchema);
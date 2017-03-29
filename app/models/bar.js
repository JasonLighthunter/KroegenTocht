var mongoose = require('mongoose');

console.log('Initializing places schema');

// define the schema for our user model
var barSchema = mongoose.Schema({
  name : String,
  place_Id : String
});

barSchema.query.byName = function(nameQuery) {
  return this.where('name').equals(nameQuery);
}

// create the model for races and expose it to our app
module.exports = mongoose.model('Bar', barSchema);
var mongoose = require('mongoose');

console.log('Initializing places schema');

// define the schema for our user model
var barSchema = mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  _id : {
    type: String,
    required: true
  }
});

barSchema.query.byName = function(nameQuery) {
  return this.where('name').equals(nameQuery);
}

// create the model for races and expose it to our app
module.exports = mongoose.model('Bar', barSchema);
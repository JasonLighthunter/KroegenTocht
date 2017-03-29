// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var raceSchema = mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  minimumAge : {
    type: Number,
    required: false,
    min: 18
  }
});

raceSchema.query.byName = function(nameQuery) {
  return this.where('name').equals(nameQuery);
}

raceSchema.query.byActive = function(activeQuery) {
  return this.where('active').equals(activeQuery);
}

// create the model for races and expose it to our app
module.exports = mongoose.model('Race', raceSchema);
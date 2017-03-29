// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var raceSchema = mongoose.Schema({
  testString : String,
  boolean    : Boolean,
  age        : Number
});

// create the model for races and expose it to our app
module.exports = mongoose.model('Race', raceSchema);
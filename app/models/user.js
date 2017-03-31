// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var _        = require('underscore');

// define the schema for our user model
var userSchema = mongoose.Schema({
  roles  : [String],
  races  : [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Race'}],
  local  : {
    email    : String,
    password : String
  },
  google : {
    id    : String,
    token : String,
    email : String,
    name  : String
  },
  reddit : {
    id       : String,
    token    : String,
    username : String
  },
  isPureSocialAccount : {
    type: Boolean,
    required: true,
    default: false
  }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.hasAnyRoles = function(roles) {
  var result      = _.intersection(this.roles, roles);
  var hasAnyRoles = (result.length > 0);

  return hasAnyRoles;
};
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
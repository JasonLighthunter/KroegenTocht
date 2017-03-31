_ = require("underscore");

module.exports = function(roleUser) {
  var user = roleUser;
 
  //all users including anonymous can:

  user.use(function(req) {
    console.log(req.isAuthenticated());
    if(!req.isAuthenticated()) {
      return false;
    }
  });

  // All Logged in Users can:
  // See all pages except secret page

  user.use('access private race(s)', function (req) {
    if (req.user.id === req.params.userId) {
      return true;
    }
  });

  // Logged in admins can:
  // See everything
  user.use(function(req) {
    if(!req.user) {
      return false;
    }
    if(req.user.hasAnyRoles(['admin'])) {
      return true;
    }
  });

  return user;
};


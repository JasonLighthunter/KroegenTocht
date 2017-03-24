module.exports = function(express, passport, crypto) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('index.ejs');
  });

  router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user
    });
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { 
      message : req.flash('loginMessage') 
    });
  });

  router.post('/login', 
    passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login',   // redirect back to the signup page if there is an error
      failureFlash    : true        // allow flash messages
    })
  );

  router.get('/signup', function(req, res) {
    res.render('signup.ejs', { 
      message: req.flash('signupMessage') 
    });
  });

  // process the signup form
  router.post('/signup', 
    passport.authenticate('local-signup', {
      successRedirect : '/signupsucces', // redirect to the secure profile section
      failureRedirect : '/signup',  // redirect back to the signup page if there is an error
      failureFlash    : true        // allow flash messages
    })
  );

  router.get('/signupsucces', function(req, res) {
    req.logout();
    res.render('signupsucces.ejs');
  });

  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  // router.get('/auth/google', 
  //   passport.authenticate('google', {
  //     scope : ['profile', 'email'] 
  //   })
  // );

  // // the callback after google has authenticated the user
  // router.get('/auth/google/callback', 
  //   passport.authenticate('google', {
  //     successRedirect : '/profile',
  //     failureRedirect : '/'
  //   })
  // );



  // // =====================================
  // // REDDIT ROUTES =======================
  // // =====================================
  // // send to reddit to do authentication
  // router.get('/auth/reddit', function(req, res, next) {
  //   req.session.state = crypto.randomBytes(32).toString('hex');
  //   passport.authenticate('reddit', {
  //     state    : req.session.state,
  //     duration : 'permanent'
  //   })(req, res, next);
  // });

  // router.get('/auth/reddit/callback', function(req, res, next){
  //   passport.authenticate('reddit', {
  //     successRedirect : '/profile',
  //     failureRedirect : '/'
  //   })(req, res, next);
  // });

  // router.get('/connect/local', function(req, res) {
  //   res.render('connect-local.ejs', { 
  //     message : req.flash('loginMessage') 
  //   });
  // });
    
  // router.post('/connect/local', 
  //   passport.authenticate('local-signup', {
  //     successRedirect : '/profile',       // redirect to the secure profile section
  //     failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
  //     failureFlash    : true              // allow flash messages
  //   })
  // );

  // // google ---------------------------------
  // // send to google to do the authentication
  // router.get('/connect/google', 
  //   passport.authorize('google', { 
  //     scope : ['profile', 'email'] 
  //   })
  // );

  // // the callback after google has authorized the user
  // router.get('/connect/google/callback',
  //   passport.authorize('google', {
  //     successRedirect : '/profile',
  //     failureRedirect : '/'
  //   }
  // ));

  // // reddit ---------------------------------
  // // send to reddit to do authorization
  // router.get('/connect/reddit', function(req, res, next) {
  //   req.session.state = crypto.randomBytes(32).toString('hex');
  //   passport.authenticate('reddit', {
  //     state    : req.session.state,
  //     duration : 'permanent',
  //   })(req, res, next);
  // });

  // router.get('/connect/reddit/callback', function(req, res, next) {
  //   passport.authenticate('reddit', {
  //     successRedirect : '/profile',
  //     failureRedirect : '/'
  //   })(req, res, next);
  // });

  // router.get('/unlink/local', function(req, res) {
  //   var user            = req.user;
  //   user.local.email    = undefined;
  //   user.local.password = undefined;
  //   user.save(function(err) {
  //     res.redirect('/profile');
  //   });
  // });

  //   // google ---------------------------------
  // router.get('/unlink/google', function(req, res) {
  //   var user          = req.user;
  //   user.google.token = undefined;
  //   user.save(function(err) {
  //     res.redirect('/profile');
  //   });
  // });

  // router.get('/unlink/reddit', function(req, res) {
  //   var user          = req.user;
  //   user.reddit.token = undefined;
  //   user.save(function(err) {
  //     res.redirect('/profile');
  //   });
  // });

  return router;
};

// module.exports = function(app, passport, crypto) {
//   // =====================================
//   // HOME PAGE (with login links) ========
//   // =====================================
//   app.get('/', function(req, res) {
//     res.render('index.ejs'); // load the index.ejs file
//   });

//   // =====================================
//   // PROFILE SECTION =====================
//   // =====================================
//   // we will want this protected so you have to be logged in to visit
//   // we will use route middleware to verify this (the isLoggedIn function)
//   app.get('/profile', isLoggedIn, function(req, res) {
//     res.render('profile.ejs', {
//       user : req.user // get the user out of session and pass to template
//     });
//   });

//   // =====================================
//   // LOGOUT ==============================
//   // =====================================
//   app.get('/logout', function(req, res) {
//     req.logout();
//     res.redirect('/');
//   });
//   // ==========================================================
//   // AUTHENTICATE (FIRST LOGIN) ===============================
//   // ==========================================================

//   // =====================================
//   // LOGIN ===============================
//   // =====================================
//   // show the login form
//   app.get('/login', function(req, res) {
//     // render the page and pass in any flash data if it exists
//     res.render('login.ejs', { 
//       message : req.flash('loginMessage') 
//     });
//   });

//   // process the login form
//   app.post('/login', passport.authenticate('local-login', {
//     successRedirect : '/profile', // redirect to the secure profile section
//     failureRedirect : '/login', // redirect back to the signup page if there is an error
//     failureFlash    : true // allow flash messages
//   }));

//   // =====================================
//   // SIGNUP ==============================
//   // =====================================
//   // show the signup form
//   app.get('/signup', function(req, res) {
//     res.render('signup.ejs', { message: req.flash('signupMessage') });
//   });

//   // process the signup form
//   app.post('/signup', passport.authenticate('local-signup', {
//     successRedirect : '/profile', // redirect to the secure profile section
//     failureRedirect : '/signup', // redirect back to the signup page if there is an error
//     failureFlash    : true // allow flash messages
//   }));

//   // =====================================
//   // GOOGLE ROUTES =======================
//   // =====================================
//   // send to google to do the authentication
//   // profile gets us their basic information including their name
//   // email gets their emails
//   app.get('/auth/google', passport.authenticate('google', {
//     scope : ['profile', 'email'] 
//   }));

//   // the callback after google has authenticated the user
//   app.get('/auth/google/callback', passport.authenticate('google', {
//     successRedirect : '/profile',
//     failureRedirect : '/'
//   }));

//   // =====================================
//   // REDDIT ROUTES =======================
//   // =====================================
//   // send to reddit to do authentication
//   app.get('/auth/reddit', function(req, res, next){
//     req.session.state = crypto.randomBytes(32).toString('hex');
//     passport.authenticate('reddit', {
//       state    : req.session.state,
//       duration : 'permanent'
//     })(req, res, next);
//   });

//   app.get('/auth/reddit/callback', function(req, res, next){
//     // Check for origin via state token
//     passport.authenticate('reddit', {
//       successRedirect : '/profile',
//       failureRedirect : '/'
//     })(req, res, next);
//   });
  
//   // =============================================================================
//   // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
//   // =============================================================================

//   // locally --------------------------------
//   app.get('/connect/local', function(req, res) {
//    res.render('connect-local.ejs', { message: req.flash('loginMessage') });
//   });
  
//   app.post('/connect/local', passport.authenticate('local-signup', {
//     successRedirect : '/profile', // redirect to the secure profile section
//     failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
//     failureFlash    : true // allow flash messages
//   }));

//   // google ---------------------------------
//   // send to google to do the authentication
//   app.get('/connect/google', passport.authorize('google', { 
//     scope : ['profile', 'email'] 
//   }));
//   // the callback after google has authorized the user
//   app.get('/connect/google/callback',
//     passport.authorize('google', {
//       successRedirect : '/profile',
//       failureRedirect : '/'
//     }
//   ));

//   // reddit ---------------------------------
//   // send to reddit to do authorization
//   app.get('/connect/reddit', function(req, res, next){
//     req.session.state = crypto.randomBytes(32).toString('hex');
//     passport.authenticate('reddit', {
//       state    : req.session.state,
//       duration : 'permanent',
//     })(req, res, next);
//   });

//   app.get('/connect/reddit/callback', function(req, res, next){
//     // Check for origin via state token
//     passport.authenticate('reddit', {
//       successRedirect : '/profile',
//       failureRedirect : '/'
//     })(req, res, next);
//   });

//   // =============================================================================
//   // UNLINK ACCOUNTS =============================================================
//   // =============================================================================
//   // local -----------------------------------
//   app.get('/unlink/local', function(req, res) {
//     var user            = req.user;
//     user.local.email    = undefined;
//     user.local.password = undefined;
//     user.save(function(err) {
//       res.redirect('/profile');
//     });
//   });

//   // google ---------------------------------
//   app.get('/unlink/google', function(req, res) {
//     var user          = req.user;
//     user.google.token = undefined;
//     user.save(function(err) {
//       res.redirect('/profile');
//     });
//   });

//   app.get('/unlink/reddit', function(req, res) {
//     var user          = req.user;
//     user.reddit.token = undefined;
//     user.save(function(err) {
//       res.redirect('/profile');
//     });
//   });
// };
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/');
}

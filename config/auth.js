module.exports = {
  'googleAuth' : {
    'clientID'     : '781738022894-efon6bv0h7877026rlsb6lofrfef8sjk.apps.googleusercontent.com',
    'clientSecret' : 'gsN4mrOaeCGKC0TSeHsbhkzI',
    'callbackURL'  : process.env.GOOGLE_CALLBACK || 'http://127.0.0.1:8080/auth/google/callback'
  },
  'redditAuth' : {
    'clientID'      : 'BwnKz59fD292Qw',
    'clientSecret'  : 'q_NHWt0HV0zY76pRL5EHSOKT5N4',
    'callbackURL'   : process.env.REDDIT_CALLBACK || 'http://127.0.0.1:8080/auth/reddit/callback'  
  }
};

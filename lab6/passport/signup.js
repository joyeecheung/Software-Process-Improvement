var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
  passport.use('signup', new LocalStrategy({
    // allows us to pass back the entire request to the callback
    passReqToCallback: true
  }, signup));

  function signup(req, username, password, done) {

    // find a user in Mongo with provided username
    User.findOne({
      'username': username
    }).exec().then(signupHandler, function(err) {
      console.log('Error in SignUp: ' + err);
      return done(err);
    });

    function signupHandler(user) {
      // already exists
      if (user) {
        console.log('User already exists with username: ' + username);
        return done(null, false, req.flash('message', '用户已经存在'));
      } else {
        // if there is no user with that email
        // create the user
        var newUser = new User();

        // set the user's local credentials
        newUser.username = username;
        newUser.password = createHash(password);
        newUser.email = req.param('email');
        newUser.name = req.param('name');
        newUser.isTeacher = req.param('role') === "teacher";

        // save the user
        // Note: mongoose save is not a promise
        newUser.save(function(err) {
          if (err) {
            console.log('Error in Saving user: ' + err);
            throw err;
          }
          console.log('User Registration succesful' + newUser);
          return done(null, newUser);
        });
      }
    }
  }

  // Generates hash using bCrypt
  function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

}

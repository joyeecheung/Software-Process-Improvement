var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  }, login));

  function login(req, username, password, done) {
    // check in mongo if a user with username exists or not
    User.findOne({
      'username': username
    }).exec().then(handleLogin, function(err) {
      console.log('Error in Login: ' + err);
      return done(err);
    });

    function handleLogin(user) {
      // Username does not exist, log the error and redirect back
      if (!user) {
        console.log('User Not Found with username ' + username);
        return done(null, false, req.flash('message', '用户不存在'));
      }
      // User exists but wrong password, log the error 
      if (!isValidPassword(user, password)) {
        console.log('Invalid Password');
        return done(null, false, req.flash('message', '密码错误')); // redirect back to login page
      }
      // User and password both match, return user from done method
      // which will be treated like success
      return done(null, user);
    }
  }

  function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
  }

}

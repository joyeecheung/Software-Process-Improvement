var express = require('express'),
    router = express.Router(),
    list = require('../controllers/list'),
    grade = require('../controllers/grade'),
    publish = require('../controllers/publish'),
    submit = require('../controllers/submit');

function isAuthenticated(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

function isTeacher(req, res, next) {
  if(req.user.isTeacher)
    return next();

  res.redirect('/home');
}

module.exports = function(app, passport) {

  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', {
      message: req.flash('message')
    });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res) {
    res.render('register', {
      message: req.flash('message')
    });
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  /* GET Home Page */
  router.get('/home', isAuthenticated, list.get(app, 'home'));

  /* GET Home Page */
  router.get('/publish/:id', isAuthenticated, isTeacher, publish.get(app, 'publish'));

  return router;
}

var express = require('express'),
    router = express.Router(),
    auth = require('../middlewares/auth'),
    home = require('../controllers/home');

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
  router.get('/home', auth.isAuthenticated, home.get(app, 'my-homework'));

  return router;
}

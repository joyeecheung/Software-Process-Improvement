var express = require('express'),
    router = express.Router(),
    auth = require('../middlewares/auth'),
    requirement = require('../controllers/requirement'),
    homework = require('../controllers/homework'),
    course = require('../controllers/course'),
    user = require('../controllers/user');

var isAuthenticatedAPI = auth.isAuthenticatedAPI,
    isTeacher = auth.isTeacher,
    isStudent = auth.isStudent;

module.exports = function(app, passport) {
  router.get('/user/me', isAuthenticatedAPI,
              user.get(app));

  router.get('/courses', isAuthenticatedAPI,
              course.get(app));
  router.get('/courses/all', isAuthenticatedAPI,
             course.getAll(app));

  router.get('/requirements/:id', isAuthenticatedAPI,
              requirement.get(app));
  router.post('/requirements', isAuthenticatedAPI, isTeacher,
              requirement.post(app));
  router.put('/requirements/:id', isAuthenticatedAPI, isTeacher,
              requirement.put(app));
  // router.post('/requirements', isAuthenticatedAPI, isTeacher,
  //             function(req, res) {
  //               console.log(req.body);
  //             });
  // router.put('/requirements/:id', isAuthenticatedAPI, isTeacher,
  //             function(req, res) {
  //               console.log(req.body);
  //             });

  router.get('/homeworks/:id', isAuthenticatedAPI,
             homework.get(app));
  router.post('/homeworks', isAuthenticatedAPI, isStudent,
             homework.post(app));
  router.put('/homeworks/:id', isAuthenticatedAPI,
             homework.put(app));

  return router;
}
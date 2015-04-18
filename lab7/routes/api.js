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

  router.get('/requirement/:id', isAuthenticatedAPI,
              requirement.get(app));
  router.post('/requirements', isAuthenticatedAPI, isTeacher,
              requirement.post(app));
  // idempotent
  router.put('/requirement/:id', isAuthenticatedAPI, isTeacher,
              requirement.put(app));

  router.get('/homework/:id', isAuthenticatedAPI,
             homework.get(app));
  router.post('/homeworks', isAuthenticatedAPI, isStudent,
             homework.postNew(app));
  // non-idempotent
  router.post('/homework/:id', isAuthenticatedAPI,
             homework.postUpdate(app));

  return router;
}
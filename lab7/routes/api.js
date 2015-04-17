var express = require('express'),
    router = express.Router(),
    auth = require('../middlewares/auth'),
    list = require('../controllers/list'),
    requirement = require('../controllers/requirement'),
    homework = require('../controllers/homework'),
    course = require('../controllers/course');

module.exports = function(app, passport) {
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
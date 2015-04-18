var User = require('../models/user'),
    Course = require('../models/course');

exports.getAll = function(app) {
  function get(req, res) {
    if (req.user.isTeacher) { // teacher
      Course
      .find()  // 1
      .lean()
      .deepPopulate('requirements.homeworks.student')  // 2
      .exec()
      .then(function(courses) {
        res.json(courses);  // 3
      });
    } else {  // student
      User
      .findOne({ username: req.user.username })  // 1
      .lean()
      .deepPopulate('courses.requirements.homeworks.student') // 2
      .exec()
      .then(function(user) {
        // 3 filter out unnecessary homeworks
        user.courses.forEach(function(c) {
          c.requirements.forEach(function(r) {
            r.homeworks = r.homeworks.filter(function(h) {
              return h.student.username === user.username;
            });
          });
        });

        res.json(user.courses);  // 4
      });
    }
  }

  return get;
};

exports.get = function(app) {
  function get(req, res) {
    User
    .findOne({ username: req.user.username })  // 1
    .lean()
    .populate('courses')
    .exec()
    .then(function(user) {
      res.json(user.courses);
    });
  }

  return get;
};
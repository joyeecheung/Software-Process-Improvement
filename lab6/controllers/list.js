var User = require('../models/user'),
    Course = require('../models/course'),
    Requirement = require('../models/requirement'),
    Homework = require('../models/homework');
var dateFormat = require('dateformat');

exports.get = function(app, template) {
  function get(req, res) {
    if (!req.user.isTeacher) {
      User.findOne({
        username: req.user.username
      }).lean().deepPopulate('courses.requirements.homeworks.student')
      .exec(function(err, user) {
        if (err) throw err;

        user.courses.forEach(function(c) {
          c.requirements.forEach(function(r) {
            r.homeworks = r.homeworks.filter(function(h) {
              return h.student.username === user.username
            });
          });
        });

        res.render(template, {
          user: user,
          courses: user.courses,
          dateFormat: dateFormat
        });
      });
    } else {
      Course.find().lean()
      .deepPopulate('requirements.homeworks.student')
      .exec(function(err, courses) {
        if (err) throw err;
        res.render(template, {
          user: req.user,
          courses: courses,
          dateFormat: dateFormat
        });
      });
    }
  }

  return get;
}
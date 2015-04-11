var User = require('../models/user'),
    Course = require('../models/course'),
    Requirement = require('../models/requirement'),
    Homework = require('../models/homework');

exports.get = function(app, template) {
  function get(req, res) {
    if (!req.user.isTeacher) {
      User.findOne({
        username: req.user.username
      }).deepPopulate('courses.requirements.homeworks')
      .exec(function(err, user) {
        if (err) throw err;

        user.courses.forEach(function(c) {
          c.requirements.forEach(function(r) {
            console.log("==============")
            console.log(r.homeworks);
            r.homeworks = r.homeworks.filter(function(h) {
              return h.student === user._id
            });
          });
        });

        res.render(template, {
          user: user,
          courses: user.courses
        });
      });
    } else {
      Course.find()
      .deepPopulate('requirements.homeworks')
      .exec(function(err, courses) {
        if (err) throw err;
        res.render(template, {
          user: req.user,
          courses: courses
        });
      });
    }
  }

  return get;
}
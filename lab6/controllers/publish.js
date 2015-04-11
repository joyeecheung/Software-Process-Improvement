var User = require('../models/user'),
    Course = require('../models/course'),
    Requirement = require('../models/requirement'),
    Homework = require('../models/homework');

exports.get = function(app, template) {
  function get(req, res) {
    if (req.params.id === 'new') {
      User
      .findOne({username: req.user.username})
      .populate('courses')
      .exec(function(err, user) {
        console.log(user.courses);
        res.render(template, {
          user: req.user,
          courses: user.courses,
          create: true,
          requirement: {}
        });
      });
    }
  }

  return get;
}
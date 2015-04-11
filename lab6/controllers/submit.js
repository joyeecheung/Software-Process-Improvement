var User = require('../models/user'),
    Course = require('../models/course'),
    Requirement = require('../models/requirement'),
    Homework = require('../models/homework');
var dateFormat = require('dateformat');

exports.get = function(app, template) {
  function get(req, res) {
    console.log(req.query);
    if (req.params.id === 'new') {
      Requirement
      .findOne({_id: req.query.requirement})
      .populate('course')
      .exec(function(err, requirement) {
        if (requirement.deadline < Date()) {
          console.log('====================Not Ended');
          res.render(template, {
            user: req.user,
            course: requirement.course,
            create: true,
            ended: true,
            requirement: requirement
          });
        } else {
          console.log('====================Ended');
          res.render(template, {
            user: req.user,
            course: requirement.course,
            create: true,
            ended: false,
            requirement: requirement
          });
        }
      });
    } else {
      Homework
      .findOne({_id: req.params.id})
      .deepPopulate('requirement.course')
      .exec(function(err, homework) {
        console.log(homework.requirement.deadline)
        if (homework.requirement.deadline < Date()) {
          console.log('ended')
          res.render(template, {
            user: req.user,
            homework: homework,
            create: false,
            ended: true,
            requirement: homework.requirement
          })
        } else {
          res.render(template, {
            user: req.user,
            homework: homework,
            create: false,
            ended: false,
            requirement: homework.requirement
          })
        }
      });
    }
  }

  return get;
}

exports.post = function(app, template) {
  function post(req, res) {
}

  return post;
}
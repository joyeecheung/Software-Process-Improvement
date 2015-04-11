var User = require('../models/user'),
    Course = require('../models/course'),
    Requirement = require('../models/requirement'),
    Homework = require('../models/homework');
var dateFormat = require('dateformat');

exports.get = function(app, template) {
  function get(req, res) {
    if (req.params.id === 'new') {
      Course
      .find({teacher: req.user._id})
      .populate('courses')
      .exec(function(err, courses) {
        if (!courses) {
          res.render(template, {
            message: "你没有课程",
            user: req.user,
            error: true
          });
          return;
        }

        res.render(template, {
          user: req.user,
          courses: courses,
          create: true,
          requirement: {},
          dateFormat: dateFormat
        });
      });
    } else {
      Requirement.findOne({
        _id: req.params.id 
      }).populate('course')
      .exec(function(err, requirement) {
        res.render(template, {
          user: req.user,
          courses: [],
          create: false,
          requirement: requirement,
          dateFormat: dateFormat,
          ended: requirement.deadline < new Date(),
          message: req.query.success ? {
            level: 'success',
            text: '发布成功！'
          } : undefined
        });
      });
    }
  }

  return get;
}

exports.post = function(app, template) {
  function post(req, res) {
    var newRequirement = {
      deadline: new Date(req.param('deadline')),
      content: req.param('content'),
      name: req.param('name')
    };

    if (req.params.id === 'new') {
      newRequirement['course'] = req.param('course');
      console.log(req);

      var requirement = new Requirement(newRequirement);

      requirement.save(function(err) {
        if (err) {
          console.log('Error in Saving requirement: ' + err);
          throw err;
        }

        Course
        .update({_id: requirement.course},
          {$push: {requirements: requirement._id}}
        ).exec(function(err) {
          if (err) {
            console.log('Error in Updating course: ' + err);
            throw err;
          }

          res.redirect('/publish/' + requirement._id + '?success=true');
        });
        
      });
    } else {
      Requirement
      .findOneAndUpdate({_id: req.params.id}, {$set: newRequirement})
      .exec(function(err, requirement) {
        if (err) {
          console.log('Error in Saving requirement: ' + err);
          throw err;
        }
        res.redirect('/publish/' + requirement._id + '?success=true');
      });
    }
  }

  return post;
}
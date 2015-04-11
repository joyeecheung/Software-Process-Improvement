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
        res.render(template, {
          user: req.user,
          create: true,
          ended: requirement.deadline < Date(),
          requirement: requirement
        });
      });
    } else {
      Homework
      .findOne({_id: req.params.id})
      .deepPopulate('requirement.course')
      .exec(function(err, homework) {
        res.render(template, {
          user: req.user,
          homework: homework,
          create: false,
          ended: homework.requirement.deadline < Date(),
          requirement: homework.requirement
        });
      });
    }
  }

  return get;
}

exports.post = function(app, template) {
  function post(req, res) {
    var newHomework = {
      content: req.param('content'),
      student: req.user._id
    };

    if (req.params.id === 'new') {
      newHomework['requirement'] = req.param('requirement');
      var homework = new Homework(newHomework);

      homework.save(function(err) {
        if (err) {
          console.log('Error in Saving homework: ' + err);
          throw err;
        }

        Requirement
        .update({_id: homework.requirement},
          {$push: {homeworks: homework._id}}
        ).exec(function(err) {
          if (err) {
            console.log('Error in Updating Requirement: ' + err);
            throw err;
          }

          res.redirect('/submit/' + homework._id);
        });
      });
    } else {
      Homework
      .findOneAndUpdate({_id: req.params.id}, {$set: newHomework})
      .exec(function(err, homework) {
        if (err) {
          console.log('Error in Saving homework: ' + err);
          throw err;
        }
        res.redirect('/submit/' + homework._id);
      });
    }
  }

  return post;
}
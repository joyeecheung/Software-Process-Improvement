var User = require('../models/user'),
    Course = require('../models/course'),
    Requirement = require('../models/requirement'),
    Homework = require('../models/homework');

exports.get = function(app) {
  function get(req, res) {
    Homework
    .findOne({_id: req.params.id})
    .deepPopulate('requirement.course')
    .exec()
    .then(function(homework) {
      res.json(homework);
    });
  }
  return get;
};

exports.postNew = function(app) {
  function post(req, res) {
    var newHomework = {
      content: req.params.content,
      student: req.user._id,
      requirement: req.params.requirement
    };

    var homework = new Homework(newHomework);

    homework
    .save(function(err) {
      if (err) {
        console.log('Error in Saving homework: ' + err);
        throw err;
      }

      Requirement
      .update({ _id: homework.requirement },
              { $push: { homeworks: homework._id } })
      .exec()
      .then(function() {
        res.json({
          success: true,
          homework: homework
        });
      });
    });

  }

  return post;
};

exports.postUpdate = function(app) {

  function post(req, res) {
    var newHomework = {};
    if (req.user.isTeacher) {
      newHomework.grade = Number(req.params.grade);
    } else {
      newHomework.content = req.params.content;
    }

    Homework
    .findOneAndUpdate({ _id: req.params.id },
                      { $set: newHomework })
    .exec()
    .then(function(homework) {
      res.json({
        success: true,
        homework: homework
      });
    });
  }

  return put;
};
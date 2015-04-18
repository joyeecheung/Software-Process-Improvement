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
      if (!req.user.isTeacher && !homework.student.equals(req.user._id)) {
        console.log('belong to ' + homework.student + ', user is ' + req.user._id)
        res.status(403).end();
      } else {
        res.json(homework);
      }
    });
  }
  return get;
};

exports.post = function(app) {
  function post(req, res) {
    var newHomework = {
      content: req.body.content,
      student: req.user._id,
      requirement: req.body.requirement
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

exports.put = function(app) {

  function put(req, res) {
    var newHomework = {};
    if (req.user.isTeacher) {
      newHomework.grade = Number(req.body.grade);
    } else {
      newHomework.content = req.body.content;
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

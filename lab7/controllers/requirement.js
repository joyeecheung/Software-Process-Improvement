var User = require('../models/user'),
    Course = require('../models/course'),
    Requirement = require('../models/requirement'),
    Homework = require('../models/homework');

exports.get = function(app) {
  function get(req, res) {
    Requirement
    .findOne({_id: req.params.id})
    .populate('course')
    .exec()
    .then(function(requirement) {
      res.json(requirement);
    });
  }

  return get;
};

exports.post = function(app) {
  function post(req, res) {
    var newRequirement = {
      deadline: new Date(req.body.deadline),
      content: req.body.content,
      name: req.body.name,
      course: req.body.course
    };

    var requirement = new Requirement(newRequirement);

    requirement
    .save(function(err) {
      if (err) {
        console.log('Error in Saving requirement: ' + err);
        throw err;
      }

      Course
      .update({ _id: requirement.course },
              { $push: { requirements: requirement._id } })
      .exec()
      .then(function() {
        res.json({
          success: true,
          requirement: requirement
        });
      });
    });

  }

  return post;
};

exports.put = function(app) {
  function put(req, res) {
    var newRequirement = {
      deadline: new Date(req.body.deadline),
      content: req.body.content,
      name: req.body.name
    };

    Requirement
    .findOneAndUpdate({ _id: req.params.id },
                      { $set: newRequirement })
    .exec()
    .then(function(requirement) {
      res.json({
        success: true,
        requirement: requirement
      });
    });
  }
  return put;
};

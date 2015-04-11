var User = require('../models/user'),
    Course = require('../models/course'),
    Requirement = require('../models/requirement'),
    Homework = require('../models/homework');

exports.get = function(app, template) {
  function get(req, res) {
    Homework
    .findOne({_id: req.params.id})
    .deepPopulate('requirement.course student')
    .exec(function(err, homework) {
      console.log(req.query.success);
      res.render(template, {
        user: req.user,
        homework: homework,
        ended: homework.requirement.deadline < new Date(),
        message: req.query.success ?{
          level: 'success',
          text: '批改成功！'
        } : undefined
      });
    });
  }

  return get;
}

exports.post = function(app, template) {
  function post(req, res) {
    Homework
    .findOneAndUpdate({_id: req.params.id},
      {$set: {grade: Number(req.param('grade'))}}
    ).exec(function(err, homework) {
      if (err) {
        console.log('Error in Saving homework: ' + err);
        throw err;
      }

      res.redirect('/grade/' + homework._id + '?success=true');
    });
  }

  return post;
}
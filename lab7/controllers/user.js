var User = require('../models/user');

exports.get = function(app) {
  function get(req, res) {
    User
    .findOne({ username: req.user.username })
    .lean()
    .exec()
    .then(function(user) {
      res.json(user);
    });
  }

  return get;
}
exports.get = function(app, template) {
  function get(req, res) {
    res.render(template, {
      user: req.user
    });
  }
  return get;
}
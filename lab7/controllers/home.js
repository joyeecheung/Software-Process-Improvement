exports.get = function(app, template) {
  function get(req, res) {
    res.render(template);
  }
  return get;
}
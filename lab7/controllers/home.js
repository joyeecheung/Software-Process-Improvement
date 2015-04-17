exports.get = function(app, templates) {
  function get(req, res) {
    if (req.user.isTeacher) {
      res.render(template.teacher);
    } else {
      res.render(template.student);
    }
  }
  return get;
}
Accounts.onCreateUser(function(options, user) {
  user.isTeacher = false;
  var course = Courses.findOne({code: 'spi'});
  user.courses = [course._id];
  return user;
});

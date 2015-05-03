Template.registerHelper('getCourses', function() {
  var user = Meteor.user();
  var courses = user.courses;
  return Courses.find({_id: {$in: courses}});
});

Template.registerHelper('getCourseName', function(id) {
  var course = Courses.findOne({_id: id});
  return course.name;
});


Template.registerHelper('getRequirementsByCourse', function(courseId) {
  return Requirements.find({courseId: courseId});
});

Template.registerHelper('getHomeworkById', function(homeworkId) {
  return Homeworks.find({_id: homeworkId});
});

Template.registerHelper('dued', function(deadline) {
  var now = new Date();
  return deadline < now;
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('YYYY-MM-DD');
});

Template.registerHelper('errorMessage', function(field, store) {
  return Session.get(store)[field];
});

Template.registerHelper('errorClass', function(field, store) {
  return !!Session.get(store)[field] ? 'has-error' : '';
});

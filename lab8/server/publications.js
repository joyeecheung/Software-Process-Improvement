Meteor.publish('courses', function() {
  var user = Meteor.users.find(this.userId);
  return Courses.find({_id: {$in: user.courses}});
});

Meteor.publish('requirements', function() {
  var user = Meteor.users.find(this.userId);
  return Requirements.find({courseId: {$in: user.courses}});
});

Meteor.publish('studentHomeworks', function() {
  return Homeworks.find({
    studentId: this.userId
  });
});

Meteor.publish('teacherHomeworks', function() {
  return Homeworks.find();
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({},
                             {fields: {'isTeacher': 1,
                                      'courses': 1 }});
  } else {
    this.ready();
  }
});
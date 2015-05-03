Meteor.publish('courses', function() {
  if (!this.userId) {
      this.ready();
      return;
  }
  var user = Meteor.users.findOne(this.userId);
  return Courses.find({_id: {$in: user.courses}});
});

Meteor.publish('requirements', function() {
  if (!this.userId) {
      this.ready();
      return;
  }
  var user = Meteor.users.findOne(this.userId);
  return Requirements.find({courseId: {$in: user.courses}});
});

Meteor.publish('studentHomeworks', function() {
  if (!this.userId) {
      this.ready();
      return;
  }
  return Homeworks.find({
    studentId: this.userId
  });
});

Meteor.publish('teacherHomeworks', function() {
  if (!this.userId) {
      this.ready();
      return;
  }
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
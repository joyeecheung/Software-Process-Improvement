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

Meteor.publish('homeworks', function() {
  if (!this.userId) {
      this.ready();
      return;
  }

  var user = Meteor.users.findOne(this.userId);
  if (user.isTeacher) {
    return Homeworks.find();
  } else {
    return Homeworks.find({
      studentId: this.userId
    });
  }
});


Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({},
                             {fields: {'isTeacher': 1,
                                      'courses': 1,
                                      'profile': 1 }});
  } else {
    this.ready();
  }
});
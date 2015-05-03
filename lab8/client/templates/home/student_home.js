Template.studentHome.helpers({
  courses: function() {
    var courses = Meteor.user().courses;
    return Courses.find({_id: {$in: courses}});
  }
});

Template.courseItem.helpers({
  requirements: function(courseId) {
    return Requirements.find({courseId: courseId});
  }
});

Template.requirementItem.helpers({
  homework: function(requirementId) {
    return Homeworks.findOne({requirementId: requirementId});
  },
  formateDate: function(date) {
    return moment(date).format('YYYY-MM-DD');
  }
});

Template.emptyHomework.helpers({
  dued: function(deadline) {
    var now = new Date();
    return deadline < now;
  }
});

Template.submittedHomework.helpers({
  dued: function(deadline) {
    var now = new Date();
    return deadline < now;
  }
});
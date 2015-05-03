Template.teacherHome.helpers({
  courses: function() {
    var courses = Meteor.user().courses;
    return Courses.find({_id: {$in: courses}});
  }
});

Template.teacherCourseItem.helpers({
  requirements: function(courseId) {
    return Requirements.find({courseId: courseId});
  }
});

Template.teacherRequirementItem.helpers({
  dued: function(deadline) {
    var now = new Date();
    return deadline < now;
  },
  formateDate: function(date) {
    return moment(date).format('YYYY-MM-DD');
  }
});

Template.teacherHomeworkItem.helpers({
  getUserName: function(studentId) {
    return Meteor.users.findOne(studentId).profile.name;
  }
});
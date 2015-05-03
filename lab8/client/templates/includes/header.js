Template.header.helpers({
  isTeacher: function() {
    var user = Meteor.user();
    if (user && user.isTeacher) {
      return true;
    } else {
      return false;
    }
  }
});
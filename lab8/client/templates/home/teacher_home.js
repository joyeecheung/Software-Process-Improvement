Template.teacherRequirementItem.helpers({
  getHomeworkByRequirement: function(requirementId) {
    return Homeworks.find({requirementId: requirementId});
  }
});

Template.teacherHomeworkItem.helpers({
  getUserName: function(studentId) {
    return Meteor.users.findOne(studentId).profile.name;
  }
});
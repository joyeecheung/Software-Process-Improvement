Template.teacherRequirementItem.helpers({
  getHomeworksByRequirement: function(requirementId) {
    return Homeworks.find({requirementId: requirementId});
  }
});

Template.teacherHomeworkItem.helpers({
  getUserName: function(studentId) {
    return Meteor.users.findOne(studentId).profile.name;
  }
});
Template.studentRequirementItem.helpers({
  getHomeworkByRequirement: function(requirementId) {
    return Homeworks.findOne({requirementId: requirementId});
  }
});
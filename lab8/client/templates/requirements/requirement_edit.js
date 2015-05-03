Template.editRequirement.onCreated(function() {
  Session.set('requirementEditErrors', {});
});

Template.editRequirement.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var _id = template.data._id;
    var requirement = {
      name: $(e.target).find('[name=name]').val(),
      deadline: new Date($(e.target).find('[name=date]').val()),
      content: $(e.target).find('[name=content]').val(),
      courseId: template.data.courseId
    };

    var errors = validateRequirement(requirement);
    if (!_.isEmpty(errors))
      return Session.set('requirementEditErrors', errors);

    Requirements.update(_id, {$set: requirement}, function(err) {
      if (err) throwError(err.reason);
      else Router.go('home');
    });
  }
});

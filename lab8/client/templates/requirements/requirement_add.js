Template.addRequirement.onCreated(function() {
  Session.set('requirementAddErrors', {});
});

Template.addRequirement.events({
  'submit form': function(e) {
    e.preventDefault();

    var requirement = {
      name: $(e.target).find('[name=name]').val(),
      deadline: new Date($(e.target).find('[name=date]').val()),
      courseId: $(e.target).find('[name=course]:checked').val(),
      content: $(e.target).find('[name=content]').val()
    }

    var errors = validateRequirement(requirement);
    if (!_.isEmpty(errors))
      return Session.set('requirementAddErrors', errors);

    Meteor.call('requirementInsert', requirement, function(err, result) {
      if (err) return throwError(err.reason);
      Router.go('home');
    });
  }
});

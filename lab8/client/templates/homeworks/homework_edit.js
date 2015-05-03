Template.editHomework.onCreated(function() {
  Session.set('homeworkEditErrors', {});
});

Template.editHomework.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var homeworkAttributes = {
      content: $(e.target).find('[name=content]').val()
    };

    var errors = {};
    if (!homeworkAttributes.content) {
      errors.content = "内容不能为空";
      return Session.set('homeworkAddErrors', errors);
    }

    Homeworks.update(template.data._id, {$set: homeworkAttributes}, function(err) {
      if (err) throwError(err.reason);
      else Router.go('home');
    });
  }
});
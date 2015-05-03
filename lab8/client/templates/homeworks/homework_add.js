Template.addHomework.onCreated(function() {
  Session.set('homeworkAddErrors', {});
});

Template.addHomework.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $content = $(e.target).find('[name=content]');
    var homework = {
      content: $content.val(),
      requirementId: template.data._id
    };

    var errors = {};
    if (!homework.content) {
      errors.content = "内容不能为空";
      return Session.set('homeworkAddErrors', errors);
    }

    Meteor.call('homeworkInsert', homework, function(error, homeworkId) {
      if (error){
        throwError(error.reason);
      } else {
        Router.go('home');
      }
    });
  }
});
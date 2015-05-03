Template.gradeHomework.onCreated(function() {
  Session.set('homeworkGradeErrors', {});
});

Template.gradeHomework.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var homeworkAttributes = {
      grade: parseFloat($(e.target).find('[name=grade]').val())
    };
    Homeworks.update(template.data._id, {$set: homeworkAttributes}, function(err) {
      if (err) throwError(err.reason);
      else Router.go('home');
    });
  }
});
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', {name: 'index'});

Router.route('/home',
  function() {
    var user = Meteor.user();
    if (user.isTeacher) {
      this.render('teacherHome');
    } else {
      this.render('studentHome');
    }
  },
  {name: 'home',
    data: function() {
      var user = Meteor.user();
      return Courses.find({});
    },
    waitOn: function() {
      var user = Meteor.user();
      if (user.isTeacher) {
        return [Meteor.subscribe('courses'),
                Meteor.subscribe('requirements'),
                Meteor.subscribe('studentHomeworks')];
      } else {
        return [Meteor.subscribe('courses'),
                Meteor.subscribe('requirements'),
                Meteor.subscribe('teacherHomeworks')];
      }
    }
  }
);

Router.route('/requirement/add', {name: 'addRequirement'});
Router.route('/requirement/:_id/edit', {
  name: 'editRequirement',
  data: function() {
    return Requirements.findOne(this.params._id);
  },
  waitOn: function() {
    return Meteor.subscribe('requirements');
  }
});
Router.route('/requirement/:_id/view', {
  name: 'viewRequirement',
  data: function() {
    return Requirements.findOne(this.params._id);
  },
  waitOn: function() {
    return Meteor.subscribe('requirements');
  }
});

Router.route('/homework/add/:requirementId', {
  name: 'addHomework',
  data: function() {
    return Requirements.findOne(this.params.requirementId);
  },
  waitOn: function() {
    return Meteor.subscribe('requirements');
  }
});
Router.route('/homework/:_id/edit', {
  name: 'editHomework',
  data: function() {
    return Homeworks.findOne(this.params._id);
  },
  waitOn: function() {
    return Meteor.subscribe('homeworks');
  }
});
Router.route('/homework/:_id/view', {
  name: 'viewHomework',
  data: function() {
    return Homeworks.findOne(this.params._id);
  },
  waitOn: function() {
    return Meteor.subscribe('homeworks');
  }
});
Router.route('/homework/:_id/grade', {
  name: 'gradeHomework',
  data: function() {
    return Homeworks.findOne(this.params._id);
  },
  waitOn: function() {
    return Meteor.subscribe('homeworks');
  }
});

var requireLogin = function() {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};

Router.onBeforeAction('dataNotFound', {only: [
  'addHomework',
  'requirementEdit',
  'homeworkEdit',
  'homeworkSubmit',
  'homeworkGrade']
});

Router.onBeforeAction(requireLogin, {except: 'index'});

Accounts.onLogin(function() {
  Router.go('home');
});
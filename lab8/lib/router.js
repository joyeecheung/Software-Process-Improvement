Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', {
  name: 'index'
});


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
    waitOn: function() {
      return [Meteor.subscribe('courses'),
              Meteor.subscribe('requirements'),
              Meteor.subscribe('homeworks')];
    }
  }
);

Router.route('/requirement/add', {
  name: 'addRequirement',
  waitOn: function() {
    return Meteor.subscribe('courses');
  }
});
Router.route('/requirement/:_id/edit', {
  name: 'editRequirement',
  data: function() {
    return Requirements.findOne(this.params._id);
  },
  waitOn: function() {
    return[Meteor.subscribe('requirements'), Meteor.subscribe('courses')];
  }
});
Router.route('/requirement/:_id/view', {
  name: 'viewRequirement',
  data: function() {
    return Requirements.findOne(this.params._id);
  },
  waitOn: function() {
    return [Meteor.subscribe('requirements'), Meteor.subscribe('courses')];
  }
});

Router.route('/homework/add/:_id', {
  name: 'addHomework',
  data: function() {
    return Requirements.findOne(this.params._id);
  },
  waitOn: function() {
    return [Meteor.subscribe('requirements'), Meteor.subscribe('courses')];
  }
});
Router.route('/homework/:_id/edit', {
  name: 'editHomework',
  data: function() {
    return Homeworks.findOne(this.params._id);
  },
  waitOn: function() {
    return [Meteor.subscribe('courses'),
            Meteor.subscribe('requirements'),
            Meteor.subscribe('homeworks')];
  }
});
Router.route('/homework/:_id/view', {
  name: 'viewHomework',
  data: function() {
    return Homeworks.findOne(this.params._id);
  },
  waitOn: function() {
    return [Meteor.subscribe('courses'),
            Meteor.subscribe('requirements'),
            Meteor.subscribe('homeworks')];
  }
});
Router.route('/homework/:_id/grade', {
  name: 'gradeHomework',
  data: function() {
    return Homeworks.findOne(this.params._id);
  },
  waitOn: function() {
    return [Meteor.subscribe('courses'),
            Meteor.subscribe('requirements'),
            Meteor.subscribe('homeworks')];
  }
});

var requireLogin = function() {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      Router.go('index');
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
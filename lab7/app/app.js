;(function() {
  'use strict';

  var app = angular.module('MyHomework', ['ui.router', 'restangular']);

  app.config(['$stateProvider', 'RestangularProvider',
   function($stateProvider, RestangularProvider) {
    $stateProvider.state('home-teacher', {
      url: '/home-teacher',
      templateUrl: '/app/home/home-teacher.html',
      controller: 'HomeTeacherCtrl'
    }).state('home-student', {
      url: '/home-student',
      templateUrl: '/app/home/home-student.html',
      controller: 'HomeStudentCtrl'
    }).state('addHomework', {
      url: '/homework/add/:requirementid',
      templateUrl: '/app/homework/homework-add.html',
      controller: 'HomeworkAddCtrl'
    }).state('editHomework', {
      url: '/homework/:id/edit',
      templateUrl: '/app/homework/homework-edit.html',
      controller: 'HomeworkEditCtrl'
    }).state('viewHomework', {
      url: '/homework/:id/view',
      templateUrl: '/app/homework/homework-view.html',
      controller: 'HomeworkViewCtrl'
    }).state('gradeHomework', {
      url: '/homework/:id/grade',
      templateUrl: '/app/homework/homework-grade.html',
      controller: 'HomeworkGradeCtrl'
    }).state('addRequirement', {
      url: '/requirement/add',
      templateUrl: '/app/requirement/requirement-add.html',
      controller: 'RequirementAddCtrl'
    }).state('editRequirement', {
      url: '/requirement/:id/edit',
      templateUrl: '/app/requirement/requirement-edit.html',
      controller: 'RequirementEditCtrl'
    }).state('viewRequirement', {
      url: '/requirement/:id/view',
      templateUrl: '/app/requirement/requirement-view.html',
      controller: 'RequirementViewCtrl'
    });

    RestangularProvider.setRestangularFields({
      id: "_id"
    });
  }]);

  app.run(['$rootScope', '$state', 'Restangular', function($rootScope, $state, Restangular) {
    var user = Restangular.one('/api/user/me').get().then(function(user) {
      $rootScope.user = user;
      if (user.isTeacher) {
        $state.go('home-teacher');
      } else {
        $state.go('home-student');
      }
    });
  }]);
  
}());
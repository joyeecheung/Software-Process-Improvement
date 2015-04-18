;(function() {
  'use strict';

  angular.module('MyHomework').controller('HomeTeacherCtrl',
    ['$scope', 'Restangular', function($scope, Restangular) {
      var courses = Restangular.all('/api/courses/all');
      courses.getList().then(function(courses) {
        $scope.courses = courses.plain();
        $scope.now = new Date();
      });
      
    }]);

  angular.module('MyHomework').controller('HomeStudentCtrl',
    ['$scope', 'Restangular', function($scope, Restangular) {
      var courses = Restangular.all('/api/courses/all');
      courses.getList().then(function(courses) {
        $scope.courses = courses.plain();
        $scope.now = new Date();
      });

    }]);
}());
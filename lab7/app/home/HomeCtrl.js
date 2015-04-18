;(function() {
  'use strict';

  function cleanCourses(oldCourses) {
    var courses = oldCourses.plain();
    for (var i = 0; i < courses.length; ++i) {
      for (var j = 0; j < courses[i].requirements.length; ++j) {
        courses[i].requirements[j].deadline = new Date(courses[i].requirements[j].deadline);
      }
    }
    return courses;
  }

  angular.module('MyHomework').controller('HomeTeacherCtrl',
    ['$scope', 'Restangular', function($scope, Restangular) {
      var courses = Restangular.all('/api/courses/all');
      courses.getList().then(function(courses) {
        $scope.courses = cleanCourses(courses);

        $scope.now = new Date();
      });
      
    }]);

  angular.module('MyHomework').controller('HomeStudentCtrl',
    ['$scope', 'Restangular', function($scope, Restangular) {
      var courses = Restangular.all('/api/courses/all');
      courses.getList().then(function(courses) {
        $scope.courses = cleanCourses(courses);
        $scope.now = new Date();
      });

    }]);
}());
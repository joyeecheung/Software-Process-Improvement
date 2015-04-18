;(function() {
  'use strict';

  angular.module('MyHomework').controller('HomeworkAddCtrl',
    ['$scope', 'Homework', function($scope, Homework) {
      $scope.now = new Date();

    }]);

  angular.module('MyHomework').controller('HomeworkEditCtrl',
    ['$scope', '$stateParams', 'Homework',
    function($scope, $stateParams, Homework) {
      $scope.now = new Date();

      Homework.one($stateParams.id).get().then(function(homework) {
        $scope.homework = homework;
      });

      $scope.gradeHomework = function() {
        $scope.homework.put().then(function(res) {
          $scope.success = res.success;
        });
      }
  }]);

  angular.module('MyHomework').controller('HomeworkViewCtrl',
    ['$scope', '$stateParams', 'Homework',
    function($scope, $stateParams, Homework) {
      $scope.now = new Date();

      Homework.one($stateParams.id).get().then(function(homework) {
        $scope.homework = homework;
      });
  }]);

  angular.module('MyHomework').controller('HomeworkGradeCtrl',
    ['$scope', '$stateParams', 'Homework',
    function($scope, $stateParams, Homework) {
      $scope.now = new Date();

      Homework.one($stateParams.id).get().then(function(homework) {
        $scope.homework = homework;
      });

      $scope.gradeHomework = function() {
        $scope.homework.put().then(function(res) {
          $scope.success = res.success;
        });
      }
  }]);
}());
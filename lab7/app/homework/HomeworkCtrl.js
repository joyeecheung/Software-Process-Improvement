;(function() {
  'use strict';

  angular.module('MyHomework').controller('HomeworkAddCtrl',
    ['$scope', '$stateParams', 'Homework', 'Requirement',
    function($scope, $stateParams, Homework, Requirement) {
      $scope.now = new Date();
      $scope.homework = {
        requirement: $stateParams.requirementid
      }

      Requirement.one($stateParams.requirementid).get().then(function(requirement) {
        requirement.deadline = new Date(requirement.deadline);
        $scope.requirement = requirement;
      });

      $scope.addHomework = function() {
        Homework.post($scope.homework).then(function(res) {
          $scope.success = res.success;
        });
      }
    }]);

  angular.module('MyHomework').controller('HomeworkEditCtrl',
    ['$scope', '$stateParams', 'Homework',
    function($scope, $stateParams, Homework) {
      $scope.now = new Date();

      Homework.one($stateParams.id).get().then(function(homework) {
        $scope.homework = homework;
      });

      $scope.editHomework = function() {
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
        homework.requirement.deadline = new Date(homework.requirement.deadline);
        $scope.homework = homework;
      });

      $scope.gradeHomework = function() {
        $scope.homework.put().then(function(res) {
          $scope.success = res.success;
        });
      }
  }]);
}());
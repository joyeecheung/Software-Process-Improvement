;(function() {
  'use strict';

  angular.module('MyHomework').controller('RequirementAddCtrl',
    ['$scope', 'Restangular', 'Requirement', function($scope, Restangular, Requirement) {
      $scope.now = new Date();
      $scope.requirement = {}

      var courses = Restangular.all('/api/courses');
      courses.getList().then(function(courses) {
        $scope.courses = courses.plain();
        $scope.now = new Date();
      });

      $scope.addRequirement= function() {
        Requirement.post($scope.requirement).then(function(res) {
          $scope.success = res.success;
        });
      }
    }]);

  angular.module('MyHomework').controller('RequirementEditCtrl',
    ['$scope', '$stateParams', 'Requirement',
    function($scope, $stateParams, Requirement) {
      $scope.now = new Date();

      Requirement.one($stateParams.id).get().then(function(requirement) {
        requirement.deadline = new Date(requirement.deadline);
        $scope.requirement = requirement;
      });

      $scope.editRequirement = function() {
        $scope.requirement.put().then(function(res) {
          $scope.success = res.success;
        });
      }
  }]);

  angular.module('MyHomework').controller('RequirementViewCtrl',
    ['$scope', '$stateParams', 'Requirement',
    function($scope, $stateParams, Requirement) {
      $scope.now = new Date();

      Requirement.one($stateParams.id).get().then(function(requirement) {
        requirement.deadline = new Date(requirement.deadline);
        $scope.requirement = requirement;
      });
  }]);
}());
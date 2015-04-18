;(function() {
  'use strict';

  angular.module('MyHomework').controller('HomeworkAddCtrl',
    ['$scope', 'Restangular', function($scope, Restangular) {
      $scope.now = new Date();
      
    }]);

  angular.module('MyHomework').controller('HomeworkEditCtrl',
    ['$scope', 'Restangular', function($scope, Restangular) {
      $scope.now = new Date();
      
  }]);

  angular.module('MyHomework').controller('HomeworkViewCtrl',
    ['$scope', 'Restangular', function($scope, Restangular) {
      $scope.now = new Date();
      
  }]);

  angular.module('MyHomework').controller('HomeworkGradeCtrl',
    ['$scope', 'Restangular', function($scope, Restangular) {
      $scope.now = new Date();
      
  }]);
}());
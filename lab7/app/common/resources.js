;(function() {
  'use strict';

  angular.module('MyHomework').factory('Homework', ['Restangular', function(Restangular) {
    return Restangular.service('api/homeworks');
  }]);

  angular.module('MyHomework').factory('Requirement', ['Restangular', function(Restangular) {
    return Restangular.service('api/requirements');
  }]);
}());
'use strict';

angular.module('manchiApp')

.controller('WritingController', ['$scope', 'writingFactory', function($scope, writingFactory) {
  $scope.lessons = writingFactory.getLessons();
}])

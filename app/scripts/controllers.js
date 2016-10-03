'use strict';

angular.module('manchiApp')
  .controller('WritingController', ['$scope', 'writingFactory', function($scope, writingFactory) {
    $scope.lessons = writingFactory.getLessons();
  }])

.controller('WritingLessonController', ['$scope', '$stateParams', 'writingFactory',
  function($scope, $stateParams, writingFactory) {
    var shengci = [];
    var lessonId = $stateParams.lessonId - 1;
    $scope.lessonId = lessonId + 1;
    var words = writingFactory.getNewWords(lessonId);
    $scope.lessonTopic = writingFactory.getLesson(lessonId).topic;
    shengci = shengci.concat(words);
    $scope.shengci = shengci;
  }
]);

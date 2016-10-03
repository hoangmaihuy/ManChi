'use strict';

angular.module('manchiApp')
  .controller('WritingController', ['$scope', 'writingFactory',
    function($scope, writingFactory) {
      $scope.lessons = writingFactory.getLessons();
    }
  ])

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
])

.controller('WritingQuestionController', ['$scope', '$stateParams', 'writingFactory',
  function($scope, $stateParams, writingFactory) {
    var lessonId = $stateParams.lessonId - 1;
    $scope.lessonId = lessonId;
    $scope.lessonTopic = writingFactory.getLesson(lessonId).topic;
    var questionId = $stateParams.questionId - 1;
    $scope.value = '';
    $scope.questionId = questionId;
    $scope.word = writingFactory.getQuestion(lessonId, questionId);
    $scope.questionLength = writingFactory.getLesson(lessonId).writeWords.length;
    $scope.accepted = false;
    $scope.checkAns = '';
    $scope.submitAns = function() {
      console.log("Hey! My button is working lol");
      if ($scope.value == $scope.word.hanzi) {
          $scope.accepted = true;
          console.log("Good game, well played!");
      } else {
        console.log("Egrrrrr! Goodluck next time!")
      }
    }
  }
])

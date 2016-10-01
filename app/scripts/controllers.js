'use strict';

angular.module('manchiApp')
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])
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
    for (var i = 0; i < words.length; i++) {
      var newWord = {
        meaning: writingFactory.translate(words[i]),
        hanzi: words[i],
        pinyin: writingFactory.getPinyin(words[i]),
        audio: writingFactory.getAudio(words[i])
      }
      console.log(newWord);
      shengci.push(newWord);
    }
    $scope.shengci = shengci;
  }
]);

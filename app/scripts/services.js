'use strict';

angular.module('manchiApp')
  .constant("baseURL", "http://localhost:3000/")
  .service('writingFactory', ['$resource', '$http', 'baseURL', function($resource, $http, baseURL) {
    var lessons = [];
    $http.get('data/writing.json').success(function(data) {
      //console.log(data);
      for(index in data) {
      //  console.log(data[index]);
        lessons.push(data[index]);
      }
    });
    console.log(lessons);
    this.getLessons = function() {
      return lessons;
    }
    this.getLesson = function(lessonIndex) {
      return lessons[lessonIndex];
    }
    this.getNewWords = function(lessonIndex) {
      return lessons[lessonIndex].newWords;
    }
    this.getWriteWords = function(lessonIndex) {
      return lessons[lessonIndex].writeWords;
    }
  }])

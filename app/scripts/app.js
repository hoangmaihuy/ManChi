'use strict';

angular.module('manchiApp', ['ui.router', 'ngResource'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'views/header.html'
          },
          'content': {
            templateUrl: 'views/home.html'
          },
          'footer': {
            templateUrl: "views/footer.html"
          }
        }
      })
    .state('app.writing', {
      url: 'writing/',
      views: {
        'content@': {
          templateUrl: 'views/writing/writing.html',
          controller: "WritingController"
        }
      }
    })
    .state('app.writing.lesson', {
      url: 'lesson/:lessonId/',
      views: {
        'content@': {
          templateUrl: 'views/writing/lesson.html',
          controller: "WritingLessonController"
        }
      }
    })
    .state('app.writing.lesson.question', {
      url: 'question/:questionId/',
      controller: "WritingQuestionController"
    });

    $urlRouterProvider.otherwise('/');
  });

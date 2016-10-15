'use strict';

angular.module('manchiApp', ['ui.router', 'ngResource', 'ui.bootstrap', 'ezfb'])
  .config(function(ezfbProvider) {
    ezfbProvider.setInitParams({
      appId      : '659284600914573',
      xfbml      : true,
      version    : 'v2.8'
    })
  })
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
        views: {
          'content@': {
            templateUrl: 'views/writing/question.html',
            controller: "WritingQuestionController"
          }
        }
      })
      .state('app.thankyou', {
        url: 'thankyou/',
        views: {
          'content@': {
            templateUrl: 'views/thankyou.html',
            controller: "ThankYouController"
          }
        }
      })
      .state('app.changelog', {
        url: 'changelog/',
        views: {
          'content@': {
            templateUrl: 'views/changelog.html'
          }
        }
      })
      .state('app.audiobook', {
        url: 'audiobook/',
        views: {
          'content@': {
            templateUrl: 'views/audiobook.html',
            controller: "AudiobookController"
          }
        }
      })

    $urlRouterProvider.otherwise('/');
  })

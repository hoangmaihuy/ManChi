'use strict';

var pinyinAPI = 'https://glosbe.com/transliteration/api?from=Han&dest=Latin&text=';
var translateAPI = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyBH7j0CU9uXgS16Rw_i_mbhyxatt0-0gts&q=';
var ttsAPI = 'http://api.voicerss.org/?key=bab0dd3181c24a1199cd31b5b0075482&hl=zh-cn&r=-5&f=48khz_16bit_stereo&src=';

angular.module('manchiApp')
  .constant("baseURL", "http://localhost:3000/")
  .service('writingFactory', ['$resource', '$http', 'baseURL', function($resource, $http, baseURL) {
    var lessons = [];
    $http.get('data/writing.json').success(function(data) {
      //console.log(data);
      for (index in data) {
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
     this.getPinyin = function(word) {
      var pinyin = '';
      $http.get(pinyinAPI + word + '&format=json').success(function(data) {
        console.log(data);
        pinyin = data.text;
      });
      console.log(pinyin);
      return pinyin;
    } 
    this.translate = function(word) {
      var meaning = '';
      $http.get(translateAPI + word + '&source=zh-CN&target=en').success(function(data) {
        console.log(data.data.translations[0].translatedText);
        meaning = data.data.translations[0].translatedText;
      });
      console.log(meaning);
      return meaning;
    }
    this.getAudio = function(word) {
      return ttsAPI + word;
    }
  }]);

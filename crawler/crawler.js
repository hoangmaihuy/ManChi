'use strict'

var fs = require('fs');
var pinyin = require('pinyin');
var tts = require('./voice-rss-tts/index.js');
var randomString = require('random-string');
var config, writing, translator;

fs.readFile('./config.json', function(err, data) {
  if (err) throw err;
  config = JSON.parse(data);
  console.log(config);
  translator = require('@google-cloud/translate')({
    key: config.googleAPIKey
  })
  process();
})

function process() {
  fs.readFile('./writing/writing.json', function(err, data) {
    if (err) throw err;
    writing = JSON.parse(data);
    console.log(writing);
    var processWritingPromise = new Promise(processWriting);
    processWritingPromise.then(function(data) {
      console.log(data);
      fs.writeFile('writing.json', JSON.stringify(data), function(err) {
        if (err) throw err;
        console.log('Check new writing.json');
      })
    }).catch(function(err) {
      throw err;
    })
  })
}

function convert(word) {
  var newWord = {
    hanzi: word,
    pinyin: '',
    audio: '',
    meaning: ''
  }
  newWord.pinyin = pinyin(word).join('');
  console.log(newWord.pinyin);
  translator.translate(word, 'en', function(err, translation) {
    if (err) throw err;
    newWord.meaning = translation;
    console.log(translation);
  })
  tts.speech({
    key: config.ttsAPIKey,
    hl: 'zh-cn',
    src: word,
    r: -5,
    c: 'mp3',
    f: '48khz_16bit_stereo',
    ssml: false,
    b64: false,
    callback: function(err, content) {
      if (err) throw err;
      var filePath = './audio/' + randomString() + '.mp3';

      fs.writeFile(filePath, content, function(err) {
        if (err) throw err;
        console.log('Successfully save ' + word + ' to ' + filePath);
        newWord.audio = filePath;
      })
    }
  })
  return newWord;
}

function createLesson(lesson) {
  var newLesson = {
    topic: lesson.topic,
    newWords: [],
    writingWords: []
  }
  for (var i in lesson.newWords) newLesson.newWords.push(convert(lesson.newWords[i]));
  for (var j in lesson.writingWords) newLesson.writingWords.push(convert(lesson.writingWords[j]));
  return newLesson;
}

function processWriting() {
  var data = [];
  for (var i = 0; i < writing.length; i++) {
    data.push(createLesson(writing[i]));
  }
  return data;
}

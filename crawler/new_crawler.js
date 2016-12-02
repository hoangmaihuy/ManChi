'use strict'

var fs = require('fs');
var pinyin = require('pinyin');
var tts = require('./voice-rss-tts/index.js');
var randomString = require('random-string');
var readline = require('readline');
var MsTranslator = require('mstranslator');
var Writing, Client, lessonId, newLesson, lesson, ttsAPIKey;
var bookId = 2;
var bookPath = './writing/hanyu_jiaocheng_' + bookId + '.json';
var dataPath = './writing.json';

openJSON('./config.json')
  .then(config => {
    console.log('Config loaded');
    console.log('Opening file...');
    Client = new MsTranslator({
      client_id: config.translatorId,
      client_secret: config.translatorSecret
    }, true);
    ttsAPIKey = config.ttsAPIKey;
    return openJSON(bookPath);
  })
  .then(writing => {
    console.log('Done parsing writing.json');
    Writing = writing;
    return ask('Which lesson do you want to add? ');
  })
  .then(_lessonId => {
    console.log('Now processing lesson ' + _lessonId);
    lessonId = _lessonId - (bookId-1)*15;
    lesson = Writing[lessonId - 1];
    newLesson = {
      topic: lesson.topic,
      newWords: [],
      writeWords: []
    }
    return getWords(lesson.newWords);
  })
  .then(_newWords => {
    console.log('Finish getting newWords');
    newLesson.newWords = _newWords;
    return getWords(lesson.writeWords);
  })
  .then(_writeWords => {
    console.log('Finish getting writeWords');
    newLesson.writeWords = _writeWords;
    return newLesson;
  })
  .then(writeData);

function openFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    })
  })
}

function openJSON(path) {
  return openFile(path).then(JSON.parse);
}

function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) reject(err);
      resolve(path);
    })
  })
}

function writeData(newLesson) {
  openJSON(dataPath).then(database => {
    console.log('Opened database');
    database[lessonId - 1 + (bookId-1)*15] = newLesson;
    writeFile(dataPath, JSON.stringify(database)).then(path => {
      console.log('Saved database successfully to ' + path);
    })
  })
}

function readConfig(path) {
  return new Promise((resolve, reject) => {
    openJSON(path).then(config => {
      resolve(config)
    })
  })
}

function ask(question) {
  return new Promise((resolve, reject) => {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question(question, ans => {
      rl.close();
      resolve(ans);
    })
  })
}

function getMeaning(params) {
  return new Promise((resolve, reject) => {
    Client.translate(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}

function getSpeech(params) {
  return new Promise((resolve, reject) => {
    Client.speak(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}

function getTTS(word) {
  return new Promise((resolve, reject) => {
    tts.speech({
      key: ttsAPIKey,
      hl: 'zh-cn',
      src: word,
      r: -5,
      c: 'mp3',
      f: '48khz_16bit_stereo',
      ssml: false,
      b64: false,
      callback: function(err, content) {
        if (err) reject(err);
        resolve(content);
      }
    })
  })
}

function convert(word) {
  var newWord;
  newWord = {
    hanzi: word,
    pinyin: pinyin(word).join(' '),
    audio: '',
    meaning: ''
  };
  return getMeaning({
    text: word,
    from: 'zh-CHS',
    to: 'en'
  }).then(meaning => {
    console.log('Meaning of ' + word + ' is ' + meaning);
    newWord.meaning = meaning;
    return getTTS(word);
  }).then(buffer => {
    var audioPath = './audio/' + 'lesson_' + (lessonId + (bookId-1)*15) + '_' + randomString() + '.mp3';
    return writeFile(audioPath, buffer);
  }).then(audioPath => {
    console.log('Saved audio of ' + word + ' to ' + audioPath + ' successfully');
    newWord.audio = audioPath;
    return newWord;
  })
}

function getWords(wordArr) {
  return Promise.all(wordArr.map((word) => {
    return convert(word);
  }));
}

'use strict'

var fs = require('fs');
var pinyin = require('pinyin');
var tts = require('./voice-rss-tts/index.js');
var randomString = require('random-string');
var readline = require('readline');
var config, writing, translator, database;

fs.readFile('./config.json', function(err, data) {
  if (err) throw err;
  config = JSON.parse(data);
  //console.log(config);
  translator = require('@google-cloud/translate')({
    key: config.googleAPIKey
  })
  fs.readFile('./writing/writing.json', function(err, data) {
    if (err) throw err;
    writing = JSON.parse(data);
    //console.log(writing);
    var openResult = new Promise(function(resolve, reject) {
      fs.readFile('./writing.json', function(err, data) {
        if (err) throw err;
        database = JSON.parse(data);
        //console.log(database);
        resolve();
      })
    })
    var ask = new Promise(function(resolve, reject) {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question('Which lesson do you want to add? ', function(answer) {
        console.log("Now processing lesson ", answer);
        rl.close();
        createLesson(writing[answer - 1]).then(function(lesson) {
          database[answer - 1] = lesson;
          resolve(database);
        })
      })
    }).then(writeData);
    openResult.then(ask);
    /* processWriting().then(writeData).catch(function(err) {
      if (err) throw err;
    }); */
  })
})

function writeData(data) {
  console.log(data);
  fs.writeFile('writing.json', JSON.stringify(data), function(err) {
    if (err) throw err;
    console.log('Check new file at ./crawler/writing.json');
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
  //console.log(newWord.pinyin);
  var p1 = new Promise(function(resolve, reject) {
    translator.translate(word, 'en', function(err, translation) {
      if (err) throw err;
      newWord.meaning = translation.toLowerCase();
      console.log(translation);
      resolve();
    })
  })

  var p2 = new Promise(function(resolve, reject) {
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
          resolve();
        })
      }
    })
  })
  return Promise.all([p1, p2]).then(function() {
    return newWord;
  })
}

function createLesson(lesson) {
  var newLesson = {
    topic: lesson.topic,
    newWords: [],
    writeWords: []
  }
  var promiseArr1 = [];
  for (var i in lesson.newWords) {
    promiseArr1.push(new Promise(function(resolve, reject) {
      convert(lesson.newWords[i]).then(function(newWord) {
        //newLesson.newWords.push(newWord);
        resolve(newWord);
      });
    }))
  }
  var p1 = Promise.all(promiseArr1).then(function(newWords) {
    //console.log(newWords);
    newLesson.newWords = newLesson.newWords.concat(newWords);
  })
  var promiseArr2 = [];
  for (var j in lesson.writeWords) {
    promiseArr2.push(new Promise(function(resolve, reject) {
      convert(lesson.writeWords[j]).then(function(writeWord) {
        //newLesson.writeWords.push(newWord);
        resolve(writeWord);
      })
    }))
  }
  var p2 = Promise.all(promiseArr2).then(function(writeWords) {
    //console.log(writeWords);
    newLesson.writeWords = newLesson.writeWords.concat(writeWords);
  })
  return Promise.all([p1, p2]).then(function() {
    return newLesson;
  })
}

function processWriting() {
  var promiseArr = [];
  for (var i in writing) {
    promiseArr.push(new Promise(function(resolve, reject) {
      createLesson(writing[i]).then(function(lesson) {
        resolve(lesson);
      })
    }))
  }
  return Promise.all(promiseArr).then(function(data) {
    return data;
  })
}
